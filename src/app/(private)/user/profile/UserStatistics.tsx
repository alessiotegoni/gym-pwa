"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Dumbbell, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserWorkoutStats } from "@/lib/queries";
import { use } from "react";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-sm text-sm">
        <p className="font-medium">{`${label}: ${payload[0].value} allenamenti`}</p>
      </div>
    );
  }

  return null;
};

export default function UserStatistics({
  statsPromise,
}: {
  statsPromise: ReturnType<typeof getUserWorkoutStats>;
}) {
  const stats = use(statsPromise);
  // Sort the monthly data by month number to ensure correct order
  const sortedMonthlyData = stats.monthlyData.toSorted(
    (a, b) => a.month - b.month
  );

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Statistiche</h3>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center p-2 border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900 rounded-xl">
          <Dumbbell className="!size-6 mb-1 dark:text-primary" />
          <span className="text-xl font-bold">{stats.totalWorkouts}</span>
          <span className="text-xs text-muted-foreground">Allenamenti</span>
        </div>
        <div className="flex flex-col items-center p-2 border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900 rounded-xl">
          <CalendarDays className="!size-6 mb-1 dark:text-primary" />
          <span className="text-xl font-bold">
            {stats.currentMonthWorkouts}
          </span>
          <span className="text-xs text-muted-foreground">Questo mese</span>
        </div>
        <div className="flex flex-col items-center p-2 border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900 rounded-xl">
          <Trophy className="!size-6 mb-1 dark:text-primary" />
          <span className="text-xl font-bold">{stats.lastMonthWorkouts}</span>
          <span className="text-xs text-muted-foreground">Mese scorso</span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Allenamenti mensili</CardTitle>
          <CardDescription>Confronto degli ultimi mesi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedMonthlyData}>
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="workouts"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
export function UserStatisticsSkeleton() {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Statistiche</h3>

      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-[80px] w-full rounded-xl" />
        <Skeleton className="h-[80px] w-full rounded-xl" />
        <Skeleton className="h-[80px] w-full rounded-xl" />
      </div>

      <Skeleton className="h-[250px] w-full" />
    </section>
  );
}
