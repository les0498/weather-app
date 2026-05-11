import { Skeleton } from "@/shared/ui/Skeleton";

export function FavoriteWeatherCardSkeleton() {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* 상단 컬러 바 */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-indigo-500" />

      <div className="p-4">
        {/* 별칭 + 온도 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-24" /> {/* 별칭 */}
            <Skeleton className="h-3 w-16" /> {/* 장소명 */}
          </div>
          <Skeleton className="h-8 w-12" /> {/* 온도 */}
        </div>

        {/* 날씨 상태 버튼 */}
        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" /> {/* description */}
            <Skeleton className="h-3 w-16" /> {/* 최저/최고 */}
          </div>
          <Skeleton className="mt-1.5 h-2.5 w-24" /> {/* 탭해서 상세 보기 */}
        </div>

        {/* 삭제 버튼 */}
        <Skeleton className="mt-3 h-3 w-8" />
      </div>
    </article>
  );
}
