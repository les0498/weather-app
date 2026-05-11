import { WeatherCard } from "@/entities/weather/ui/WeatherCard";
import { WeatherCardSkeleton } from "./WeatherCardSkeleton";
import { ErrorBox } from "@/shared/ui/ErrorBox";
import type { WeatherSummary } from "@/entities/weather/model/types";
import { ERROR_MESSAGES } from "@/shared/constants/errorMessages";

interface WeatherMainProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  weather: WeatherSummary | null;
}

export function WeatherMain({
  isLoading,
  isError,
  error,
  weather,
}: WeatherMainProps) {
  // 기존 로딩 스피너 → 스켈레톤으로 교체
  if (isLoading) return <WeatherCardSkeleton />;

  if (isError) {
    return (
      <ErrorBox
        message={
          error instanceof Error ? error.message : ERROR_MESSAGES.WEATHER
        }
      />
    );
  }

  if (!weather) return null;

  return (
    <div className="w-full rounded-2xl bg-white/70 shadow-sm backdrop-blur-sm sm:rounded-3xl">
      <WeatherCard weather={weather} />
    </div>
  );
}
