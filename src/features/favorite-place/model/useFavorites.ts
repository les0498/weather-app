import { useEffect, useState } from "react";
import type { FavoritePlace } from "@/entities/weather/model/types";

const STORAGE_KEY = "weather-favorites";
const MAX_COUNT = 6;

const getInitialFavorites = (): FavoritePlace[] => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const useFavorites = () => {
  const [favorites, setFavorites] =
    useState<FavoritePlace[]>(getInitialFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (favorite: FavoritePlace): boolean => {
    if (favorites.some((item) => item.placeId === favorite.placeId)) {
      return true;
    }

    if (favorites.length >= MAX_COUNT) {
      return false;
    }

    setFavorites((prev) => [...prev, favorite]);
    return true;
  };

  const removeFavorite = (placeId: string) => {
    setFavorites((prev) => prev.filter((item) => item.placeId !== placeId));
  };

  const updateAlias = (placeId: string, alias: string) => {
    setFavorites((prev) =>
      prev.map((item) =>
        item.placeId === placeId
          ? { ...item, alias: alias.trim() || item.name }
          : item,
      ),
    );
  };

  const isFavorite = (placeId?: string) => {
    if (!placeId) return false;
    return favorites.some((item) => item.placeId === placeId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateAlias,
    isFavorite,
  };
};
