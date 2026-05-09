import type { FavoritePlace } from "@/entities/favorite/model/types";
import { useWeatherQuery } from "../../../entities/weather/model/useWeatherQuery";

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

  return (
    <article className="rounded-2xl border border-slate-200 p-4 transition hover:shadow-md">
      <button
        type="button"
        onClick={() => onSelect(favorite)}
        className="block w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <input
              defaultValue={favorite.alias}
              onBlur={(e) => onUpdateAlias(favorite.placeId, e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-sky-500"
            />
            <p className="mt-1 text-xs text-slate-500">{favorite.name}</p>
          </div>

          {data && (
            <p className="text-xl font-bold text-slate-900">
              {data.currentTemp}°
            </p>
          )}
        </div>

        {isLoading && (
          <p className="mt-4 text-xs text-slate-400">날씨 불러오는 중...</p>
        )}

        {isError && (
          <p className="mt-4 text-xs text-red-500">
            날씨 정보를 불러오지 못했습니다.
          </p>
        )}

        {data && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span>{data.description}</span>
            <span>
              최저 {data.minTemp}° / 최고 {data.maxTemp}°
            </span>
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={() => onRemove(favorite.placeId)}
        className="mt-3 text-xs font-semibold text-red-500"
      >
        삭제
      </button>
    </article>
  );
}
