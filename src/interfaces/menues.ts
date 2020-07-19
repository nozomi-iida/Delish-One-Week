import { IMaterial } from "./favorites";

export interface IMenu {
  id: string,
  foodName: string,
  foodImg: string,
  materials: IMaterial[]
};