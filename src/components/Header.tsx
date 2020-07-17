import React from 'react';
import {  NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import firebase from '../firebase/firebase';

export default () => {
  const onLogOutClick = () => {
    firebase.auth().signOut();
    console.log('sign out');
  };
  return (
    <div>
      <Typography variant="h1" >Delish One Week</Typography>
      <NavLink to='/' >Favorites</NavLink>:
      <NavLink to='/menues' >Menues</NavLink>:
      <NavLink to='/addFavorite' >Add Favorite</NavLink>:
      <Button variant="contained" color="primary" onClick={onLogOutClick}>
        ログアウト
      </Button>
    </div>
  )
}