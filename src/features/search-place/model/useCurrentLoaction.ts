import { useEffect, useState } from "react";
import { getCurrentPosition } from "@/shared/lib/geolocation";

type Coordinates = { lat: number; lon: number };

interface UseCurrentLocationReturn {
  coords: Coordinates | null;
  setCoords: React.Dispatch<React.SetStateAction<Coordinates | null>>;
  locationError: string | null;
}

export function useCurrentLocation(): UseCurrentLocationReturn {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentPosition()
      .then((position) =>
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      )
      .catch(() => setLocationError("현재 위치를 가져올 수 없습니다."));
  }, []);

  return { coords, setCoords, locationError };
}
