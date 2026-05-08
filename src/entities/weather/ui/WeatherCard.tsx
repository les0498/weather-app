import type { WeatherSummary } from "../model/types";

type WeatherCardProps = {
  weather: WeatherSummary;
};

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-sky-100">현재 날씨</p>
          <h2 className="mt-1 text-2xl font-bold">{weather.locationName}</h2>
          <p className="mt-2 text-sm text-sky-100">{weather.description}</p>
        </div>

        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="h-20 w-20 drop-shadow"
          />
        )}
      </div>

      <div className="mt-8 flex items-end justify-between">
        <p className="text-7xl font-bold tracking-tight">
          {weather.currentTemp}°
        </p>

        <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm backdrop-blur">
          <p>최저 {weather.minTemp}°</p>
          <p className="mt-1">최고 {weather.maxTemp}°</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white/15 p-4 backdrop-blur">
        <h3 className="text-sm font-semibold">시간대별 기온</h3>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {weather.hourlyTemps.map((item) => (
            <div
              key={item.time}
              className="min-w-20 rounded-2xl bg-white/20 px-4 py-3 text-center"
            >
              <p className="text-xs text-sky-100">{item.time}</p>
              <p className="mt-2 text-xl font-bold">{item.temp}°</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
