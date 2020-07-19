import { IMenu } from "../interfaces/menues";

type IMenuesActions = any

const initialState: IMenu[] = [];

export default (state = initialState, action: IMenuesActions) => {
  console.log(action.updates)
  switch(action.type) {
    case 'ADD_MENUES':
      return [
        ...state,
        action.menues
      ]
    case 'SET_MENUES':
      return [
        ...action.menues
      ]
    case 'UPDATE_MENUES':
      return state.map((menu: IMenu) => {
        if(menu.id === action.id) {
          return {
            ...menu,
            ...action.updates
          }
        } else {
          return menu
        };
      });
    default: 
      return state;
  };
};