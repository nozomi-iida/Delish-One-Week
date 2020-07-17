import { IFavorite } from "../interfaces/favorites";

interface IAddFavoriteAction {
  type: "ADD_FAV";
  favorite: IFavorite;
};

interface ISetFavesAction {
  type: "SET_FAVES";
  favorites: IFavorite[];
}

interface IRemoveFavAction {
  type: "REMOVE_FAV";
  id: string
}

interface IEditFavAction {
  type: "EDIT_FAV";
  id: string,
  updates: any
};

type IFavoritesActions = | IAddFavoriteAction | ISetFavesAction | IRemoveFavAction | IEditFavAction

const initialState: IFavorite[] = [];

export default (state = initialState, action: IFavoritesActions) => {
  switch(action.type) {
    case 'ADD_FAV':
      return [
        ...state,
        action.favorite
      ]
    case 'SET_FAVES':
      return [
        ...action.favorites
      ];
    case 'REMOVE_FAV':
      return state.filter(({id}) => {
        return id !== action.id
      });
    case 'EDIT_FAV':
      return state.map((favorite: any) => {
        if (favorite.id === action.id) {
          return {
            ...favorite,
            ...action.updates
          };
        } else {
          return favorite
        };
      });
    default: 
      return state;
  };
};