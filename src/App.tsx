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
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Weather App</h1>
          <p className="mt-2 text-slate-600">
            현재 위치 기반 날씨 정보를 확인합니다.
          </p>
        </header>

        <PlaceSearchBox onSelectPlace={handleSelectPlace} />

        {selectedPlaceName && (
          <p className="text-sm text-slate-500">
            선택한 장소: {selectedPlaceName}
          </p>
        )}

        {locationError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {locationError}
          </div>
        )}

        {placeError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {placeError}
          </div>
        )}

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            날씨 정보를 불러오는 중입니다.
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "날씨 정보를 불러오지 못했습니다."}
          </div>
        )}
        {weather && <WeatherCard weather={weather} />}
      </div>
    </main>
  );
}
