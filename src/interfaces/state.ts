import { IFavorite } from './favorites';
import { IMenu } from './menues';

export interface IState {
  favorites: IFavorite[];
  menues: IMenu[];
  recipes: any[];
}
