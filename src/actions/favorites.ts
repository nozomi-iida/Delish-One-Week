export const addFavorite = (favorite: any) => ({
  type: 'ADD_FAV',
  favorite
});

export const setFavorites = (favorites: any) => ({
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