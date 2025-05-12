import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl bg-muted flex flex-col gap-4 animate-pulse">
      <Skeleton className="h-4 w-[40%]" />
      <Skeleton className="h-3 w-[70%]" />
      <Skeleton className="h-3 w-[100%]" />
      <Skeleton className="h-3 w-[85%]" />
    </div>
  );
}
