import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather, getForecast } from "../api/weatherApi";
import { normalizeWeather } from "../lib/normalizeWeather";

export const useWeatherQuery = (lat?: number, lon?: number) => {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: async () => {
      const [current, forecast] = await Promise.all([
        getCurrentWeather(lat!, lon!),
        getForecast(lat!, lon!),
      ]);

      return normalizeWeather(current, forecast);
    },
    enabled: !!lat && !!lon,

    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
    retry: 1, // 실패 시 1회 재시도
    refetchOnWindowFocus: false, // 창이 다시 포커스될 때 자동으로 새로고침하지 않음
  });
};
