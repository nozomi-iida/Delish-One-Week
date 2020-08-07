import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthStoreProvider } from './stores/AuthStore';
import Header from './components/Header';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import LoggedInRouter from './routers/LoggedInRouter';
import Favorites from './components/Favorites';
import { Provider } from 'react-redux';
import ReduxStore from './stores/ReduxStore';
import AddFavorite from './components/AddFavorite';
import EditFavorite from './components/EditFavorite';
import DetailFavorite from './components/DetailFavorite';
import Menues from './components/Menues';
import ShoppingLists from './components/ShoppingLists';
import MyPage from './components/MyPage';
import './styles/styles.scss';
import Cooking from './components/Cooking';
import CookingLists from './components/CookingLists';
import Footer from './components/Footer';

const store = ReduxStore();

export default () => {
  return (
    <AuthStoreProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Header />
          <Switch>
            <LoggedInRouter path='/' component={Favorites} exact />
            <LoggedInRouter path='/addFavorite' component={AddFavorite} />
            <LoggedInRouter path='/detail/:id' component={DetailFavorite} />
            <LoggedInRouter path='/edit/:id' component={EditFavorite} />
            <LoggedInRouter path='/menues' component={Menues} />
            <LoggedInRouter path='/shoppinglists' component={ShoppingLists} />
            <LoggedInRouter path='/mypage' component={MyPage} />
            <LoggedInRouter path='/cooking' component={Cooking} />
            <LoggedInRouter path='/cookingLists/:id' component={CookingLists} />
            <Route path='/login' component={LogIn} />
            <Route path='/signUp' component={SignUp} />
          </Switch>
          <Footer />
        </BrowserRouter>
      </Provider>
    </AuthStoreProvider>
  );
};
