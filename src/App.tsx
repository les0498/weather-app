import { useEffect, useState } from "react";
import { useWeatherQuery } from "./entities/weather/model/useWeatherQuery";
import { WeatherCard } from "./entities/weather/ui/WeatherCard";
import { getCurrentPosition } from "./shared/lib/geoloaction";
import { PlaceSearchBox } from "./features/search-place/ui/placeSearchBox";
import type { Place } from "./entities/place/model/types";
import { getCoordsByKakao } from "./shared/api/kakaoApi";
import { useFavorites } from "./features/favorite-place/model/useFavorites";
import type { FavoritePlace } from "./entities/weather/model/types";
import { FavoriteWeatherCard } from "./features/favorite-place/ui/FavoriteWeatherCard";

type Coordinates = {
  lat: number;
  lon: number;
};

export function App() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(
    null,
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    getCurrentPosition()
      .then((position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      })
      .catch(() => {
        setLocationError("현재 위치를 가져올 수 없습니다.");
      });
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

      setCoords({
        lat: Number(y),
        lon: Number(x),
      });
    } catch {
      setPlaceError("해당 장소의 정보가 제공되지 않습니다.");
    }
  };

  const handleToggleFavorite = () => {
    if (!selectedPlace || !coords) {
      return;
    }

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

    if (!success) {
      setPlaceError("즐겨찾기는 최대 6개까지 가능합니다.");
    }
  };

  const handleSelectFavorite = (favorite: FavoritePlace) => {
    setPlaceError(null);
    setSelectedPlace(null);
    setSelectedPlaceName(favorite.alias);

    setCoords({
      lat: favorite.lat,
      lon: favorite.lon,
    });
  };

  const { data, isLoading, isError, error } = useWeatherQuery(
    coords?.lat,
    coords?.lon,
  );

  const weather = data ?? null;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-sky-600">Weather App</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            오늘 날씨 확인
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            현재 위치 또는 검색한 대한민국 행정구역의 날씨를 확인합니다.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <PlaceSearchBox onSelectPlace={handleSelectPlace} />

            {selectedPlaceName && (
              <div className="rounded-2xl bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                선택한 장소:{" "}
                <span className="font-semibold text-slate-900">
                  {selectedPlaceName}
                </span>
              </div>
            )}

            {selectedPlace && (
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
              >
                {isFavorite(selectedPlace.id)
                  ? "즐겨찾기 삭제"
                  : "즐겨찾기 추가"}
              </button>
            )}
          </aside>

          <section className="min-w-0 space-y-4">
            {locationError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {locationError}
              </div>
            )}

            {placeError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {placeError}
              </div>
            )}

            {isLoading && (
              <div className="rounded-3xl bg-white p-8 text-slate-500 shadow-sm">
                날씨 정보를 불러오는 중입니다.
              </div>
            )}

            {isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error instanceof Error
                  ? error.message
                  : "날씨 정보를 불러오지 못했습니다."}
              </div>
            )}

            {weather && <WeatherCard weather={weather} />}
          </section>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">즐겨찾기</h2>
            <span className="text-xs text-slate-500">{favorites.length}/6</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {favorites.length === 0 && (
              <p className="text-sm text-slate-500">
                즐겨찾기한 장소가 없습니다.
              </p>
            )}

            {favorites.map((favorite) => (
              <FavoriteWeatherCard
                key={favorite.placeId}
                favorite={favorite}
                onSelect={handleSelectFavorite}
                onRemove={removeFavorite}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
