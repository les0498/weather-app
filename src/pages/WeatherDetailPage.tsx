import { useParams } from "react-router-dom";
import { useWeatherQuery } from "@/entities/weather/model/useWeatherQuery";
import { WeatherCard } from "@/entities/weather/ui/WeatherCard";

export function WeatherDetailPage() {
  const { lat, lon } = useParams();

  const latitude = Number(lat);
  const longitude = Number(lon);

  const { data, isLoading, isError, error } = useWeatherQuery(
    latitude,
    longitude,
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
          날씨 정보를 불러오는 중입니다.
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error instanceof Error
            ? error.message
            : "날씨 정보를 불러오지 못했습니다."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl">
        <WeatherCard weather={data} />
      </div>
    </main>
  );
}
