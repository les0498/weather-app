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
          <span>예상 최저 {weather.minTemp}°</span>
          <span>예상 최고 {weather.maxTemp}°</span>
        </div>
      </div>

      {weather.hourlyTemps.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-700">
            시간대별 기온
          </h3>

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {weather.hourlyTemps.map((item) => (
              <div
                key={item.time}
                className="min-w-20 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"
              >
                <p className="text-xs text-slate-500">{item.time}</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {item.temp}°
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
