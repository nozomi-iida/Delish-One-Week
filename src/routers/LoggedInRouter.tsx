import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthStore } from '../stores/AuthStore';
import { fireStore } from '../firebase/firebase';
import { setFavorites } from '../actions/favorites';
import { useDispatch } from 'react-redux';
import { setMenues } from '../actions/menues';

export default ({ component: Component, ...rest }: any): JSX.Element => {
  const user = useContext(AuthStore);
  const dispatch = useDispatch();

  useEffect(() => {
    const getFavorites: Array<any> = [];
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
    const getMenues: Array<any> = [];
    fireStore.collection("users").doc(`${user.uid}`).collection("menues").get().then((snapshot) => {
      snapshot.forEach((menue) => {
        getMenues.push({
          ...menue.data(),
          id: menue.id
        });
      });
    }).then(() => {
      dispatch(setMenues(getMenues))
      console.log(getMenues);
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