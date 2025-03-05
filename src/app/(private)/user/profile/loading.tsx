import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <>
      <section>
        <div className="flex justify-between mb-3">
          <Skeleton className="w-16 h-7 card-primary" />
          <Skeleton className="size-5 card-primary" />
        </div>
        <Skeleton className="w-full h-[90px] card-primary" />
      </section>
      <section className="my-4">
        <Skeleton className="w-[400px] h-7 card-primary mb-3" />
        <Skeleton className="w-full h-[120px] card-primary" />
      </section>
      <section>
        <Skeleton className="w-[100px] h-7 card-primary mb-3" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-[90px] card-primary" />
          ))}
        </div>
      </section>
    </>
  );
}
