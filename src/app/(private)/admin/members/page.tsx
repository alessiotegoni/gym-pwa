import { db } from "@/drizzle/db";
import SearchUserBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CalendarDays, CreditCard, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Gestisci membri",
  description: "Gestisci i membri della tua palestra",
};

type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function MembersPage({ searchParams }: Props) {
  const [session, { search }] = await Promise.all([auth(), searchParams]);

  if (!session) return;

  const users = await db.query.users.findMany({
    where: ({ id }, { ne }) => ne(id, session.userId),
    columns: { emailVerified: false, password: false },
    with: {
      subscriptions: {
        columns: { id: true },
        where: ({ status }, { eq }) => eq(status, "active"),
      },
      bookings: {
        columns: { id: true },
        where: ({ bookingDate }, { gte }) => gte(bookingDate, new Date()),
      },
    },
  });

  const filteredUsers = search
    ? users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <>
      <header className="mb-5">
        <h2 className="text-3xl font-bold mb-2">Utenti</h2>
        <SearchUserBar search={search} />
        <h3 className="text-lg font-medium mt-4">
          Totali: <strong>{filteredUsers.length}</strong>
        </h3>
      </header>
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="rounded-xl border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900"
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={user.image || undefined}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback>
                    {user.firstName[0].toUpperCase()}
                    {user.lastName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.email}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Registrato il: {user.createdAt.toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {!user.subscriptions.length && (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-600 border-red-200"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    No Abbonamenti attivi
                  </Badge>
                )}
                {!user.bookings.length && (
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-600 border-orange-200"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    No Prenotazioni attive
                  </Badge>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Button asChild variant="outline">
                  <Link href={`/admin/subscriptions?search=${user.email}`}>
                    <CreditCard />
                    Abbonamenti
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/admin/bookings?search=${user.email}`}>
                    <CalendarDays />
                    Prenotazioni
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
