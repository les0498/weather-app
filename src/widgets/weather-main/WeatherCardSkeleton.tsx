import { Skeleton } from "@/shared/ui/Skeleton";

export function WeatherCardSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fbfbff] via-[#95aef4] to-[#0d3a70] p-5 shadow-2xl sm:rounded-3xl sm:p-7">
      {/* 배경 장식 원 */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-blue-900/20" />

      {/* 상단: 위치 + 아이콘 */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-40 sm:h-8 sm:w-52" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-14 w-14 rounded-full sm:h-20 sm:w-20" />
      </div>

      {/* 중단: 온도 */}
      <div className="relative mt-5 flex items-end justify-between sm:mt-8">
        <Skeleton className="h-16 w-36 sm:h-24 sm:w-48" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24 sm:w-28" />
          <Skeleton className="h-4 w-24 sm:w-28" />
        </div>
      </div>

      {/* 구분선 */}
      <div className="relative mt-5 border-t border-white/30 sm:mt-8" />

      {/* 하단: 시간별 예보 */}
      <div className="relative mt-4 sm:mt-6">
        <Skeleton className="h-3 w-28" />
        <div className="mt-3 flex gap-1.5 sm:mt-4 sm:gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex min-w-[60px] flex-col items-center gap-2 rounded-xl border border-white/40 bg-white/30 px-2 py-2 sm:min-w-[72px] sm:rounded-2xl sm:px-3 sm:py-3"
            >
              <Skeleton className="h-2.5 w-8" />
              <Skeleton className="h-4 w-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
