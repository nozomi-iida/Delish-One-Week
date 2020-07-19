import { IMenu } from "../interfaces/menues";

export const addMenues = (menues: IMenu) => ({
  type: 'ADD_MENUES',
  menues
});

export const setMenues = (menues: IMenu[]) => ({
  type: 'SET_MENUES',
  menues
});

export const updateMenues = (id: string, updates: any) => ({
  type: 'UPDATE_MENUES',
  id,
  updates
})