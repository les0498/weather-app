export type Place = {
  id: string;
  name: string;
  fullName: string;
  depth: number;
};

export type FavoritePlace = {
  id: string;
  placeId: string;
  name: string;
  alias: string;
  lat: number;
  lon: number;
};
