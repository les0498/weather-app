import districts from "../../../shared/data/korea_districts.json";
import type { Place } from "../model/types";

export const places: Place[] = districts.map((district) => {
  const parts = district.split("-");
  const name = parts[parts.length - 1];

  return {
    id: district,
    name,
    fullName: district.replaceAll("-", " "),
    depth: parts.length,
  };
});
