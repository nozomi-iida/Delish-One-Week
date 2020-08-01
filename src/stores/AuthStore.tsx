import React, { createContext, useState, useEffect } from 'react';
import firebase from '../firebase/firebase';

interface IAuthState {
  user: firebase.User[];
}

const initialState: IAuthState = {
  user: [],
};

export const AuthStore = createContext<IAuthState | any>(initialState);

export const AuthStoreProvider = ({
  children,
}: JSX.ElementChildrenAttribute) => {
  const [user, setUser] = useState<IAuthState>(initialState);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user: IAuthState | any) => {
      setUser(user);
    });
  }, []);

  return <AuthStore.Provider value={user}>{children}</AuthStore.Provider>;
};
