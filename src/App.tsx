import { useEffect, useState } from "react";
import { getCurrentPosition } from "./shared/lib/geoloaction";
import { useWeatherQuery } from "@/entities/weather/model/useWeatherQuery";

export function App() {
  const [coords, setCoords] = useState<{ lat: number; lon: number }>();

  useEffect(() => {
    getCurrentPosition().then((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, []);

  const { data, isLoading } = useWeatherQuery(coords?.lat, coords?.lon);

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.main.temp}°C</p>
    </div>
  );
}

console.log(import.meta.env.VITE_WEATHER_API_KEY);
