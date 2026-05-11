import { useEffect, useState } from "react";
import { getCurrentPosition } from "@/shared/lib/geolocation";
import { ERROR_MESSAGES } from "@/shared/constants/errorMessages";

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
      .catch(() => setLocationError(ERROR_MESSAGES.LOCATION));
  }, []);

  return { coords, setCoords, locationError };
}
