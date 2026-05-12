import { useParams } from "react-router-dom";
import { useWeatherQuery } from "@/entities/weather/model/useWeatherQuery";
import { WeatherCard } from "@/entities/weather/ui/WeatherCard";
import { WeatherCardSkeleton } from "@/widgets/weather-main/WeatherCardSkeleton";
import { ErrorBox } from "@/shared/ui/ErrorBox";
import { ERROR_MESSAGES } from "@/shared/constants/errorMessages";
import { WeatherDetailStats } from "./WeatherDetailStats";

export function WeatherDetailPage() {
  const { lat, lon, locationName } = useParams();

  const { data, isLoading, isError, error } = useWeatherQuery(
    Number(lat),
    Number(lon),
    locationName ? decodeURIComponent(locationName) : undefined,
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-100 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        {isLoading && <WeatherCardSkeleton />}
        {(isError || (!isLoading && !data)) && (
          <ErrorBox
            message={
              error instanceof Error ? error.message : ERROR_MESSAGES.WEATHER
            }
          />
        )}
        {data && (
          <>
            <WeatherCard weather={data} />
            <WeatherDetailStats weather={data} />
          </>
        )}
      </div>
    </main>
  );
}
