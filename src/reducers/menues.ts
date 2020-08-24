import { IMenu } from '../interfaces/menues';

interface IAddMenuesAction {
  type: 'ADD_MENUES';
  menues: IMenu[];
}

interface ISetMenuesAction {
  type: 'SET_MENUES';
  menues: IMenu[];
};

interface IUpdateMenuesAction {
  type: 'UPDATE_MENUES';
  id: string;
  updates: IMenu[];
};

interface IEditMenues {
  type: 'EDIT_MENU';
  id: string;
  update: IMenu
}

type IMenuesActions = IAddMenuesAction | ISetMenuesAction | IUpdateMenuesAction | IEditMenues;

const initialState: IMenu[] = [
  
];

export default (state = initialState, action: IMenuesActions) => {
  switch (action.type) {
    case 'ADD_MENUES':
      return [...state, action.menues];
    case 'SET_MENUES':
      return [...action.menues];
    case 'UPDATE_MENUES':
      return state.map((menu: IMenu) => {
        if (menu.id === action.id) {
          return {
            ...menu,
            ...action.updates,
          };
        } else {
          return menu;
        }
      });
    case 'EDIT_MENU':
      return state.map((menu: IMenu) => {
        if (menu.id === action.id) {
          return {
            ...menu,
            ...action.update,
          };
        } else {
          return menu;
        }
      });
    default:
      return state;
  }
};
