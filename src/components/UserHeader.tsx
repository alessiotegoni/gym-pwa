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
  showEditUser?: boolean;
};
export default function UserHeader({
  user,
  showLogout = false,
  showEditUser = true,
}: Props) {
  return (
    <header>
      {showEditUser && (
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Profilo</h1>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/user/profile/edit" className="!size-5">
              <Edit className="!size-5" />
            </Link>
          </Button>
        </div>
      )}
      <div className="flex justify-between card-primary">
        <div className="flex items-center gap-3">
          <Avatar className="size-14">
            <AvatarImage
              src={user.image ?? ""}
              alt={`${user.firstName} ${user.lastName}`}
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
            <h2 className="text-lg font-semibold">
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
              variant="destructive"
              className="p-3 text-xs py-1 h-fit rounded-lg"
            />
          </form>
        )}
      </div>
    </header>
  );
}
