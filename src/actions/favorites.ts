import { IFavorite } from "../interfaces/favorites";

export const addFavorite = (favorite: IFavorite) => ({
  type: 'ADD_FAV',
  favorite
});

export const setFavorites = (favorites: IFavorite[]) => ({
  type: 'SET_FAVES',
  favorites
});

export const removeFavorite = (id: string) => ({
  type: 'REMOVE_FAV',
  id
});

export const editFavorite = (id: string, updates: any) => ({
  type: 'EDIT_FAV',
  id,
  updates
})