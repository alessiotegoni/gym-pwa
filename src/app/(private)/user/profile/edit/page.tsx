import { UserProfileForm } from "@/components/forms/UserProfileForm";
import { auth } from "@/lib/auth";
import { getUser } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.userId) return;

  const userProfile = await getUser({ userId: session.userId });

  if (!userProfile) notFound()

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Modifica Profilo</h1>
      <UserProfileForm user={userProfile} />
    </>
  );
}
