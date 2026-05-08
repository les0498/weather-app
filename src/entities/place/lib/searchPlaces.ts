import type { Place } from "../model/types";

export const searchPlaces = (places: Place[], keyword: string): Place[] => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return [];
  }

  return places
    .filter((place) => {
      return (
        place.name.toLowerCase().includes(normalizedKeyword) ||
        place.fullName.toLowerCase().includes(normalizedKeyword)
      );
    })
    .slice(0, 20);
};
