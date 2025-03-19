"use server";

import { db } from "@/drizzle/db";
import { dailyTrainings } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { dailyTrainingSchema } from "@/lib/schema/dailyTraining";
import { formatDate, isTrainingEditable, uploadImg } from "@/lib/utils";
import { DailyTrainingSchemaType } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTraining({
  eventId,
  date,
  trainingId,
}: {
  eventId?: number;
  date?: string;
  trainingId?: number;
}) {
  const session = await auth();

  if (!session?.userId) return;

  const result = await db.query.dailyTrainings.findFirst({
    where: ({ id, eventId: trainingEventId, trainingDate }, { and, eq }) =>
      and(
        eventId ? eq(trainingEventId, eventId) : undefined,
        trainingId ? eq(id, trainingId) : undefined,
        date ? eq(trainingDate, date) : undefined
      ),
  });

  return result;
}

export async function createTraining(values: DailyTrainingSchemaType) {
  const session = await auth();

  if (!session?.userId || !session.isAdmin) return { error: true };

  console.log(values);

  const { success, data } = dailyTrainingSchema.safeParse(values);

  if (!success) return { error: true };

  const { eventId, img, trainingTimestamp, description } = data;

  const trainingExist = await getTraining({
    eventId,
    date: formatDate(trainingTimestamp),
  });

  if (trainingExist)
    return {
      error: true,
      message: "Esiste gia un allenamento in questa data",
    };

  let imageUrl = img as string;
  if (img instanceof File) imageUrl = await uploadImg(img);

  const result = await db.insert(dailyTrainings).values({
    eventId,
    trainingDate: formatDate(trainingTimestamp),
    description,
    imageUrl,
  });

  if (!result.rowCount) return { error: true };
}

export async function editTraining(
  values: DailyTrainingSchemaType,
  trainingId: number
) {
  const session = await auth();

  if (!session?.userId || !session.isAdmin || isNaN(trainingId))
    return { error: true };

  const { success, data } = dailyTrainingSchema.safeParse(values);

  if (!success) return { error: true };

  const { img, description, trainingTimestamp } = data;

  const trainingExist = await getTraining({ trainingId });
  if (!trainingExist) return { error: true };

  if (isTrainingEditable(trainingExist.trainingDate)) {
    const trainingExist = await db.query.dailyTrainings.findFirst({
      where: ({ id, trainingDate }, { and, ne }) =>
        and(
          eq(trainingDate, formatDate(trainingTimestamp)),
          ne(id, trainingId)
        ),
    });

    if (trainingExist)
      return {
        error: true,
        message: "Esiste gia un allenamento in questa data",
      };

    let imageUrl = img as string;
    if (img instanceof File) imageUrl = await uploadImg(img);

    const trainingDate = formatDate(trainingTimestamp);

    const result = await db
      .update(dailyTrainings)
      .set({
        imageUrl,
        description,
        trainingDate,
      })
      .where(eq(dailyTrainings.id, trainingId));

    if (!result.rowCount)
      return {
        error: true,
        message: "Esiste gia un allenamento in questa data",
      };
  } else return await createTraining(values);
}

export async function deleteTraining(trainingId: number) {
  const session = await auth();

  if (!session?.userId || !session.isAdmin) return { error: true };

  if (isNaN(trainingId)) return { error: true };

  const trainingExist = await getTraining({ trainingId });

  if (!trainingExist || !isTrainingEditable(trainingExist.trainingDate))
    return { error: true };

  const result = await db
    .delete(dailyTrainings)
    .where(eq(dailyTrainings.id, trainingId));

  if (!result.rowCount) return { error: true };

  revalidatePath("/admin/trainings");
}
