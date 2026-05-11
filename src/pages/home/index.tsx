// src/pages/home/index.tsx
import { useState } from "react";

// widgets
import { Header } from "@/widgets/header/Header";
import { WeatherMain } from "@/widgets/weather-main/WeatherMain";
import { FavoritesSection } from "@/widgets/favorites-section/FavoritesSection";

// features
import { PlaceSearchBox } from "@/features/search-place/ui/placeSearchBox";
import { useCurrentLocation } from "@/features/search-place/model/useCurrentLoaction";
import { usePlaceSearch } from "@/features/search-place/model/usePlaceSearch";
import { useFavorites } from "@/features/favorite-place/model/useFavorites";

// entities
import { useWeatherQuery } from "@/entities/weather/model/useWeatherQuery";

// shared
import { ErrorBox } from "@/shared/ui/ErrorBox";

export function HomePage() {
  // 1) 위치
  const { coords, setCoords, locationError } = useCurrentLocation();

  // 2) 장소 검색
  const { selectedPlace, selectedPlaceName, placeError, handleSelectPlace } =
    usePlaceSearch(setCoords);

  // 3) 즐겨찾기
  const { favorites, addFavorite, removeFavorite, updateAlias, isFavorite } =
    useFavorites();
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  // 4) 날씨
  const { data, isLoading, isError, error } = useWeatherQuery(
    coords?.lat,
    coords?.lon,
  );

  const handleToggleFavorite = () => {
    if (!selectedPlace || !coords) return;
    if (isFavorite(selectedPlace.id)) {
      removeFavorite(selectedPlace.id);
      return;
    }
    const success = addFavorite({
      id: crypto.randomUUID(),
      placeId: selectedPlace.id,
      name: selectedPlace.name,
      alias: selectedPlace.name,
      lat: coords.lat,
      lon: coords.lon,
    });
    if (!success) setFavoriteError("즐겨찾기는 최대 6개까지 가능합니다.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-100">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* 사이드바: 검색 + 선택 장소 + 즐겨찾기 토글 */}
          <aside className="space-y-4">
            <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm">
              <PlaceSearchBox onSelectPlace={handleSelectPlace} />
            </div>

            {selectedPlaceName && (
              <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                <p className="text-xs font-medium text-slate-400">
                  선택한 장소
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedPlaceName}
                </p>
              </div>
            )}

            {selectedPlace && (
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm transition ${
                  isFavorite(selectedPlace.id)
                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                    : "bg-slate-900/80 text-white backdrop-blur-sm hover:bg-slate-900"
                }`}
              >
                {isFavorite(selectedPlace.id)
                  ? "★ 즐겨찾기 삭제"
                  : "☆ 즐겨찾기 추가"}
              </button>
            )}

            {locationError && <ErrorBox message={locationError} />}
            {placeError && <ErrorBox message={placeError} />}
            {favoriteError && <ErrorBox message={favoriteError} />}
          </aside>

          {/* 메인 날씨 위젯 */}
          <section>
            <WeatherMain
              isLoading={isLoading}
              isError={isError}
              error={error}
              weather={data ?? null}
            />
          </section>
        </div>

        {/* 즐겨찾기 위젯 */}
        <FavoritesSection
          favorites={favorites}
          onRemove={removeFavorite}
          onUpdateAlias={updateAlias}
        />
      </main>
    </div>
  );
}
