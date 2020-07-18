import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthStore } from '../stores/AuthStore';
import { fireStore } from '../firebase/firebase';
import { setFavorites } from '../actions/favorites';
import { useDispatch } from 'react-redux';

export default ({ component: Component, ...rest }: any): JSX.Element => {
  const user = useContext(AuthStore);
  const dispatch = useDispatch();

  useEffect(() => {
    const getFavorites: Array<any> = []
    fireStore.collection("users").doc(`${user.uid}`).collection("favorites").get().then((snapshot) => {
      snapshot.forEach((favorite) => {
        getFavorites.push({
          ...favorite.data(),
          id: favorite.id
        });
      });
    }).then(() => {
      dispatch(setFavorites(getFavorites))
    });
  // eslint-disable-next-line
  },[user]);

  return (
    <Route 
      {...rest}
      render={props => {
        return user ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }}
    />
  );
};