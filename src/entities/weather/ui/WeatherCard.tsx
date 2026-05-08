import type { WeatherSummary } from "../model/types";

type WeatherCardProps = {
  weather: WeatherSummary;
};

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {weather.locationName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{weather.description}</p>
        </div>

        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="h-16 w-16"
          />
        )}
      </div>

      <div className="mt-6">
        <p className="text-5xl font-bold text-slate-900">
          {weather.currentTemp}°
        </p>

        <div className="mt-4 flex gap-4 text-sm text-slate-600">
          <span>최저 {weather.minTemp}°</span>
          <span>최고 {weather.maxTemp}°</span>
        </div>
      </div>
    </section>
  );
}
