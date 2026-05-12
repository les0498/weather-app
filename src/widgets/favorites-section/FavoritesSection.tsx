import { FavoriteWeatherCard } from "@/features/favorite-place/ui/FavoriteWeatherCard";
import { FavoriteWeatherCardSkeleton } from "@/features/favorite-place/ui/FavoriteWeatherCardSkeleton";
import type { FavoritePlace } from "@/entities/favorite/model/types";
import { useNavigate } from "react-router-dom";

interface FavoritesSectionProps {
  favorites: FavoritePlace[];
  isLoading?: boolean;
  onRemove: (id: string) => void;
  onUpdateAlias: (id: string, alias: string) => void;
}

export function FavoritesSection({
  favorites,
  isLoading = false,
  onRemove,
  onUpdateAlias,
}: FavoritesSectionProps) {
  const navigate = useNavigate();

  const handleSelect = (favorite: FavoritePlace) => {
    navigate(
      `/weather/${favorite.lat}/${favorite.lon}/${encodeURIComponent(favorite.alias)}`,
    );
  };

  return (
    <section className="mt-8 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">즐겨찾기</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          {favorites.length} / 6
        </span>
      </div>

      {/* 로딩 중이면 스켈레톤 3개 표시 */}
      {isLoading ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <FavoriteWeatherCardSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 text-slate-400">
          <p className="text-sm">아직 즐겨찾기한 장소가 없어요</p>
          <p className="text-xs">장소 검색 후 즐겨찾기에 추가해보세요</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <FavoriteWeatherCard
              key={favorite.placeId}
              favorite={favorite}
              onSelect={handleSelect}
              onRemove={onRemove}
              onUpdateAlias={onUpdateAlias}
            />
          ))}
        </div>
      )}
    </section>
  );
}
