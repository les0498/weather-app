import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useWeatherQuery } from "./entities/weather/model/useWeatherQuery";
import { WeatherCard } from "./entities/weather/ui/WeatherCard";
import { getCurrentPosition } from "./shared/lib/geolocation";
import { getCoordsByKakao } from "./shared/api/kakaoApi";
import { PlaceSearchBox } from "./features/search-place/ui/placeSearchBox";
import { useFavorites } from "./features/favorite-place/model/useFavorites";
import { FavoriteWeatherCard } from "./features/favorite-place/ui/FavoriteWeatherCard";
import type { FavoritePlace } from "./entities/favorite/model/types";

import type { Place } from "./entities/place/model/types";

type Coordinates = { lat: number; lon: number };

export function App() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(
    null,
  );
  const [placeError, setPlaceError] = useState<string | null>(null);

  const { favorites, addFavorite, removeFavorite, updateAlias, isFavorite } =
    useFavorites();
  const { data, isLoading, isError, error } = useWeatherQuery(
    coords?.lat,
    coords?.lon,
  );
  const weather = data ?? null;

  useEffect(() => {
    getCurrentPosition()
      .then((position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      })
      .catch(() => setLocationError("현재 위치를 가져올 수 없습니다."));
  }, []);

  const handleSelectPlace = async (place: Place) => {
    try {
      setPlaceError(null);
      setSelectedPlace(place);
      setSelectedPlaceName(place.fullName);
      const result = await getCoordsByKakao(place.fullName);
      if (!result.documents.length) {
        setPlaceError("해당 장소의 정보가 제공되지 않습니다.");
        return;
      }
      const { x, y } = result.documents[0];
      setCoords({ lat: Number(y), lon: Number(x) });
    } catch {
      setPlaceError("해당 장소의 정보가 제공되지 않습니다.");
    }
  };

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
    if (!success) setPlaceError("즐겨찾기는 최대 6개까지 가능합니다.");
  };

  const handleSelectFavorite = (favorite: FavoritePlace) => {
    navigate(`/weather/${favorite.lat}/${favorite.lon}`);
  };

  return (
    // 배경: 흰색 → 연한 하늘색 그라데이션
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-100">
      {/* 상단 헤더 */}
      <header className="border-b border-slate-200/60 bg-white/60 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-lg font-bold text-slate-900">Weather App</span>
          <p className="hidden text-sm text-slate-400 sm:block">
            대한민국 행정구역 날씨 조회
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* 사이드바 */}
          <aside className="space-y-4">
            {/* 검색 카드 */}
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
          </aside>

          {/* 메인 날씨 */}
          <section>
            {isLoading && (
              <div className="flex h-64 items-center justify-center rounded-3xl bg-white/70 shadow-sm backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-100 border-t-sky-400" />
                  <p className="text-sm">날씨 정보를 불러오는 중...</p>
                </div>
              </div>
            )}
            {isError && (
              <ErrorBox
                message={
                  error instanceof Error
                    ? error.message
                    : "날씨 정보를 불러오지 못했습니다."
                }
              />
            )}
            {weather && (
              <div className="rounded-3xl bg-white/70 shadow-sm backdrop-blur-sm">
                <WeatherCard weather={weather} />
              </div>
            )}
          </section>
        </div>

        {/* 즐겨찾기 섹션 */}
        <section className="mt-8 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">즐겨찾기</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {favorites.length} / 6
            </span>
          </div>

          {favorites.length === 0 ? (
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
                  onSelect={handleSelectFavorite}
                  onRemove={removeFavorite}
                  onUpdateAlias={updateAlias}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-600 backdrop-blur-sm">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </div>
  );
}
