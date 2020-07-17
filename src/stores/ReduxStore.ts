import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import favoritesReducer from '../reducers/favorites';
import thunk from 'redux-thunk';

const storeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      favorites: favoritesReducer
    }),

    storeEnhancers(applyMiddleware(thunk))
  );
  return store;
};