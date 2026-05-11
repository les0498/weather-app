import { WeatherCard } from "@/entities/weather/ui/WeatherCard";
import { ErrorBox } from "@/shared/ui/ErrorBox";
import type { WeatherSummary } from "@/entities/weather/model/types";

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
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl bg-white/70 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-100 border-t-sky-400" />
          <p className="text-sm">날씨 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorBox
        message={
          error instanceof Error
            ? error.message
            : "날씨 정보를 불러오지 못했습니다."
        }
      />
    );
  }

  if (!weather) return null;

  return (
    <div className="rounded-3xl bg-white/70 shadow-sm backdrop-blur-sm">
      <WeatherCard weather={weather} />
    </div>
  );
}
