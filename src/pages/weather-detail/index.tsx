import { useParams } from "react-router-dom";
import { useWeatherQuery } from "@/entities/weather/model/useWeatherQuery";
import { WeatherCard } from "@/entities/weather/ui/WeatherCard";
import { WeatherCardSkeleton } from "@/widgets/weather-main/WeatherCardSkeleton";
import { ErrorBox } from "@/shared/ui/ErrorBox";

export function WeatherDetailPage() {
  const { lat, lon } = useParams();

  const { data, isLoading, isError, error } = useWeatherQuery(
    Number(lat),
    Number(lon),
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-100 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        {isLoading && <WeatherCardSkeleton />}
        {(isError || (!isLoading && !data)) && (
          <ErrorBox
            message={
              error instanceof Error
                ? error.message
                : "날씨 정보를 불러오지 못했습니다."
            }
          />
        )}
        {data && <WeatherCard weather={data} />}
      </div>
    </main>
  );
}
