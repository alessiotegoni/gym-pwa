import Link from "next/link";
import { Home, Calendar, User } from "lucide-react";

export default function BottomBar() {
  return (
    <nav className="sticky bottom-0 flex justify-around items-center
    px-4 py-2 bg-yellow-400 *:dark:text-black">
      <Link href="/user" className="flex flex-col items-center">
        <Home size={24} />
        <span className="text-xs">Home</span>
      </Link>
      <Link href="/schedule" className="flex flex-col items-center">
        <Calendar size={24} />
        <span className="text-xs">Schedule</span>
      </Link>
      <Link href="/user/profile" className="flex flex-col items-center">
        <User size={24} />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  );
}
