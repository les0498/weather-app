import { useEffect, useState } from "react";
import { useWeatherQuery } from "./entities/weather/model/useWeatherQuery";
import { WeatherCard } from "./entities/weather/ui/WeatherCard";
import { getCurrentPosition } from "./shared/lib/geoloaction";

type Coordinates = {
  lat: number;
  lon: number;
};

export function App() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

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

        {locationError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {locationError}
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
