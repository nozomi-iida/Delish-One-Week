interface IMenu {
  
}

type IMenuesActions = any

const initialState: any = [
  {
    foodName: 'カレー',
    foodImg: 'https://cdn.macaro-ni.jp/image/summary/80/80269/333aa190163a968dcd39e98a7e40006e.jpg?p=medium',
  }
];

export default (state = initialState, action: IMenuesActions) => {
  switch(action.type) {
    default: 
      return state;
  };
};