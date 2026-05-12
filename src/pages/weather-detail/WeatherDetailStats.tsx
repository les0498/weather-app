import type { WeatherSummary } from "@/entities/weather/model/types";

type WeatherDetailStatsProps = {
  weather: WeatherSummary;
};

function getSunProgress(sunriseStr: string, sunsetStr: string): number {
  const now = new Date();
  const toDate = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const sunrise = toDate(sunriseStr);
  const sunset = toDate(sunsetStr);
  const total = sunset.getTime() - sunrise.getTime();
  const elapsed = now.getTime() - sunrise.getTime();
  return Math.min(Math.max(elapsed / total, 0), 1);
}

function getFeelsLikeComment(temp: number, feelsLike: number): string {
  const diff = feelsLike - temp;
  if (Math.abs(diff) < 1) return "실제 온도와 비슷하게 느껴져요";
  if (diff > 0) return `실제보다 ${Math.abs(Math.round(diff))}° 높게 느껴져요`;
  return `실제보다 ${Math.abs(Math.round(diff))}° 낮게 느껴져요`;
}

export function WeatherDetailStats({ weather }: WeatherDetailStatsProps) {
  const stats = [
    { label: "체감 온도", value: `${weather.feelsLike}°`, icon: "🌡️" },
    { label: "습도", value: `${weather.humidity}%`, icon: "💧" },
    { label: "풍속", value: `${weather.windSpeed} m/s`, icon: "🍃" },
    { label: "기압", value: `${weather.pressure} hPa`, icon: "🧭" },
  ];

  const sunProgress = getSunProgress(weather.sunrise, weather.sunset);
  const isDaytime = sunProgress > 0 && sunProgress < 1;

  return (
    <section className="mt-5 rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <h2 className="text-lg font-bold text-slate-900">상세 날씨 정보</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white/80 p-4 shadow-sm"
          >
            <p className="text-2xl">{stat.icon}</p>
            <p className="mt-3 text-xs font-medium text-slate-400">
              {stat.label}
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {stat.value}
            </p>
            {stat.label === "체감 온도" && (
              <p className="mt-1 text-xs text-slate-400">
                {getFeelsLikeComment(weather.currentTemp, weather.feelsLike)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 일출·일몰 타임라인 */}
      <div className="mt-4 rounded-2xl bg-white/80 p-4 shadow-sm">
        <p className="mb-3 text-xs font-medium text-slate-400">일출 · 일몰</p>
        <div className="relative h-6 overflow-hidden rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-indigo-400">
          {isDaytime && (
            <div
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-base"
              style={{ left: `${sunProgress * 100}%` }}
            >
              ☀️
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>🌅 {weather.sunrise}</span>
          <span>🌇 {weather.sunset}</span>
        </div>
      </div>
    </section>
  );
}
