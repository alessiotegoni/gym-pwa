import Link from "next/link";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { users } from "@/drizzle/schema";
import SubmitBtn from "./SubmitBtn";
import { signOut } from "@/lib/auth";

type Props = {
  user: Pick<
    typeof users.$inferSelect,
    "firstName" | "lastName" | "image" | "email"
  >;
  showLogout?: boolean;
};
export default function UserHeader({ user, showLogout = false }: Props) {
  return (
    <header>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-xl font-semibold">Profilo</h1>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/user/profile/edit" className="!size-5">
            <Edit className="!size-5" />
          </Link>
        </Button>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage
              src={user.image || "https://placehold.co/40x40"}
              alt={user.lastName}
            />
            <AvatarFallback>
              {user.firstName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        {showLogout && (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <SubmitBtn
              label="logout"
              loadingLabel="sloggando"
              className="!bg-red-600 text-white p-3 py-1 h-fit"
            />
          </form>
        )}
      </div>
    </header>
  );
}
