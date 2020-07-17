export interface IFavorite {
  id: string,
  foodName: string,
  foodImg: string,
  created_at: number
  materials: IMaterial[]
}

export interface IState {
  favorites: IFavorite[];
};

export interface IMaterial {
  materialName: string,
  materialNum: string,
  materialUnit: string,
  materialWeight: string
}

