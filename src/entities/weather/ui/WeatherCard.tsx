import type { WeatherSummary } from "../model/types";

type WeatherCardProps = {
  weather: WeatherSummary;
};

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fbfbff] via-[#95aef4] to-[#0d3a70] p-7 shadow-2xl">
      {/* 배경 장식 원 */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-blue-900/20" />

      {/* 상단: 위치 + 아이콘 */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
            현재 날씨
          </p>
          <h2 className="mt-2 truncate text-3xl font-bold tracking-tight text-slate-900">
            {weather.locationName}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{weather.description}</p>
        </div>

        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="h-20 w-20 shrink-0 drop-shadow-lg"
          />
        )}
      </div>

      {/* 중단: 온도 */}
      <div className="relative mt-8 flex items-end justify-between gap-4">
        <p className="text-8xl font-black leading-none tracking-tighter text-slate-900">
          {weather.currentTemp}°
        </p>

        <div className="shrink-0 rounded-2xl border border-white/40 bg-white/30 px-5 py-3 text-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">↓</span>
            <span className="text-slate-700">최저 {weather.minTemp}°</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-rose-500">↑</span>
            <span className="text-slate-700">최고 {weather.maxTemp}°</span>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="relative mt-8 border-t border-white/30" />

      {/* 하단: 시간대별 예보 */}
      <div className="relative mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-600">
          향후 24시간 예보
        </h3>

        <div className="mt-4 overflow-x-auto pb-1">
          <div className="flex w-max gap-2">
            {weather.hourlyTemps.map((item) => (
              <div
                key={item.time}
                className="flex min-w-[72px] flex-col items-center rounded-2xl border border-white/40 bg-white/30 px-3 py-3 backdrop-blur-sm transition hover:bg-white/50"
              >
                <p className="text-[11px] font-medium text-slate-600">
                  {item.time}
                </p>
                {item.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                    alt={item.description}
                    className="h-8 w-8"
                  />
                )}
                <p className="text-base font-bold text-slate-900">
                  {item.temp}°
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
