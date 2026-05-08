import { useEffect, useState } from "react";
import { useWeatherQuery } from "./entities/weather/model/useWeatherQuery";
import { WeatherCard } from "./entities/weather/ui/WeatherCard";
import { getCurrentPosition } from "./shared/lib/geoloaction";
import { PlaceSearchBox } from "./features/search-place/ui/placeSearchBox";
import type { Place } from "./entities/place/model/types";
import { getCoordsByKakao } from "./shared/api/kakaoApi";

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
  const [placeError, setPlaceError] = useState<string | null>(null);

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

  const { data, isLoading, isError, error } = useWeatherQuery(
    coords?.lat,
    coords?.lon,
  );

  const weather = data ?? null;
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <header className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-sky-600">Weather App</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              오늘 날씨 확인
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              현재 위치 또는 검색한 대한민국 행정구역의 날씨를 확인합니다.
            </p>
          </header>

          <PlaceSearchBox onSelectPlace={handleSelectPlace} />
        </aside>

        <section className="space-y-4">
          {selectedPlaceName && (
            <div className="rounded-2xl bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
              선택한 장소:{" "}
              <span className="font-semibold text-slate-900">
                {selectedPlaceName}
              </span>
            </div>
          )}

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
    </main>
  );
}
