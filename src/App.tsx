import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthStoreProvider } from './stores/AuthStore';
import Header from './components/Header';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import LoggedInRouter from './routers/LoggedInRouter';
import Faborites from './components/Favorites';
import { Provider } from 'react-redux';
import ReduxStore from './stores/ReduxStore';
import AddFavorite from './components/AddFavorite';
import EditFavorite from './components/EditFavorite';
import DetailFavorite from './components/DetailFavorite';

const store = ReduxStore();

export default () => {
  return (
    <AuthStoreProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Header />
          <Switch>
              <LoggedInRouter path="/" component={Faborites} exact />  
              <LoggedInRouter path="/addFavorite" component={AddFavorite} />  
              <LoggedInRouter path="/detail/:id" component={DetailFavorite} />  
              <LoggedInRouter path="/edit/:id" component={EditFavorite} />  
              <Route path='/login' component={LogIn} />
              <Route path='/signUp' component={SignUp} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </AuthStoreProvider>
  )
}