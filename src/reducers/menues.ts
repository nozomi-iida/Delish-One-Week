interface IMenu {
  
}

type IMenuesActions = any

const initialState: any = [];

export default (state = initialState, action: IMenuesActions) => {
  console.log(action.menues)
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
    default: 
      return state;
  };
};