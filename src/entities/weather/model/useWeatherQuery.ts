import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "../api/weatherApi";

export const useWeatherQuery = (lat?: number, lon?: number) => {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => getCurrentWeather(lat!, lon!),
    enabled: !!lat && !!lon,
  });
};
