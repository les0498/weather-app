import { useState } from "react";
import type { FavoritePlace } from "@/entities/favorite/model/types";
import { useWeatherQuery } from "../../../entities/weather/model/useWeatherQuery";
import { FavoriteWeatherCardSkeleton } from "./FavoriteWeatherCardSkeleton";

type FavoriteWeatherCardProps = {
  favorite: FavoritePlace;
  onSelect: (favorite: FavoritePlace) => void;
  onRemove: (placeId: string) => void;
  onUpdateAlias: (placeId: string, alias: string) => void;
};

export function FavoriteWeatherCard({
  favorite,
  onSelect,
  onRemove,
  onUpdateAlias,
}: FavoriteWeatherCardProps) {
  const { data, isLoading, isError } = useWeatherQuery(
    favorite.lat,
    favorite.lon,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(favorite.alias);

  const handleAliasBlur = () => {
    setIsEditing(false);
    onUpdateAlias(favorite.placeId, alias);
  };

  // 로딩 중이면 스켈레톤 반환
  if (isLoading) return <FavoriteWeatherCardSkeleton />;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-indigo-500" />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <input
                autoFocus
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                onBlur={handleAliasBlur}
                onKeyDown={(e) => e.key === "Enter" && handleAliasBlur()}
                className="w-full rounded-lg border border-sky-300 bg-sky-50 px-2 py-1 text-sm font-bold text-slate-900 outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-left"
              >
                <p className="truncate text-sm font-bold text-slate-900">
                  {alias}
                </p>
                <svg
                  className="h-3 w-3 shrink-0 text-slate-400 opacity-0 transition group-hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
                  />
                </svg>
              </button>
            )}
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {favorite.name}
            </p>
          </div>

          {data && (
            <p className="shrink-0 text-2xl font-black text-slate-900">
              {data.currentTemp}°
            </p>
          )}
        </div>

        {/* isLoading 분기 제거 — 위에서 스켈레톤으로 처리 */}
        {isError && (
          <p className="mt-3 text-xs text-red-400">
            날씨 정보를 불러오지 못했습니다.
          </p>
        )}

        {data && (
          <button
            type="button"
            onClick={() => onSelect(favorite)}
            className="mt-3 w-full rounded-xl bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{data.description}</span>
              <span>
                <span className="text-sky-500">↓{data.minTemp}°</span>
                {" / "}
                <span className="text-rose-500">↑{data.maxTemp}°</span>
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              탭해서 상세 보기 →
            </p>
          </button>
        )}

        <button
          type="button"
          onClick={() => onRemove(favorite.placeId)}
          className="mt-3 flex items-center gap-1 text-[11px] font-medium text-slate-400 transition hover:text-red-500"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          삭제
        </button>
      </div>
    </article>
  );
}
