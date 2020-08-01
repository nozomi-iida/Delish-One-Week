const initialState: any = [];

export default (state = initialState, action: any) => {
  switch (action.type) {
    case 'FETCH_DAtA':
      return {
        ...state,
        recipes: action.payload,
      };
    default:
      return state;
  }
};
