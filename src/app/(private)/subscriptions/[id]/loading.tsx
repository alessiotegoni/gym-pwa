import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return Array.from({ length: 4 }, (_, i) => (
    <Skeleton key={i} className="h-[156px] card-primary mb-3" />
  ));
}
