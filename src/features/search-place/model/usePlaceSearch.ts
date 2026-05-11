// src/features/search-place/model/usePlaceSearch.ts
import { useState } from "react";
import { getCoordsByKakao } from "@/shared/api/kakaoApi";
import type { Place } from "@/entities/place/model/types";
import { ERROR_MESSAGES } from "@/shared/constants/errorMessages";

type Coordinates = { lat: number; lon: number };

interface UsePlaceSearchReturn {
  selectedPlace: Place | null;
  selectedPlaceName: string | null;
  placeError: string | null;
  clearPlaceError: () => void;
  handleSelectPlace: (place: Place) => Promise<void>;
}

export function usePlaceSearch(
  onCoordsChange: (coords: Coordinates) => void,
): UsePlaceSearchReturn {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(
    null,
  );
  const [placeError, setPlaceError] = useState<string | null>(null);

  const handleSelectPlace = async (place: Place) => {
    try {
      setPlaceError(null);
      setSelectedPlace(place);
      setSelectedPlaceName(place.fullName);

      const result = await getCoordsByKakao(place.fullName);
      if (!result.documents.length) {
        setPlaceError(ERROR_MESSAGES.PLACE);
        return;
      }
      const { x, y } = result.documents[0];
      onCoordsChange({ lat: Number(y), lon: Number(x) });
    } catch {
      setPlaceError(ERROR_MESSAGES.PLACE);
    }
  };

  return {
    selectedPlace,
    selectedPlaceName,
    placeError,
    clearPlaceError: () => setPlaceError(null),
    handleSelectPlace,
  };
}
