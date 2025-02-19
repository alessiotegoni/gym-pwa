import CreateSubscriptionForm from "@/components/forms/CreateSubscriptionForm";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";

export default async function CreateSubscriptionPage() {
  const session = await auth();

  const users = await db.query.users.findMany({
    columns: { id: true, email: true },
    where: ({ id }, { ne }) => ne(id, session?.userId!),
  });

  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">Crea abbonamento</h1>
      <CreateSubscriptionForm users={users} />
    </>
  );
}
