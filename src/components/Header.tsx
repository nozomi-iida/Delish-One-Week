import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  IconButton,
} from '@material-ui/core';
import firebase from '../firebase/firebase';
import { lime, green } from '@material-ui/core/colors';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { AuthStore } from '../stores/AuthStore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      position: 'fixed',
      width: '100vw',
      color: '#fff',
    },
    title: {
      backgroundColor: green[400],
      fontWeight: 'bold',
      padding: theme.spacing(1, 10),
    },
    span: {
      position: 'absolute',
      right: '10%',
    },
    btn: {
      backgroundColor: green[600],
      '&:hover': {
        backgroundColor: green[400],
      },
      color: '#fff',
    },
    menuContainer: {
      backgroundColor: green[200],
      display: "flex",
      justifyContent: "space-around",
      padding: theme.spacing(1, 0),
    },
  })
);

export default () => {
  const classes = useStyles();
  const user = useContext(AuthStore);

  const onLogOutClick = () => {
    firebase.auth().signOut();
    console.log('sign out');
  };

  return (
    <header className={classes.header}>
      <Typography variant='h2' component='h1' className={classes.title}>
        一週間の献立表
        {user && (
          <span className={classes.span}>
            <Button
              startIcon={<ExitToAppIcon />}
              className={classes.btn}
              onClick={onLogOutClick}
            >
              ログアウト
            </Button>
          </span>
        )}
      </Typography>
      {user && (
        <div className={classes.menuContainer}>
          <NavLink to='/'>お気に入り</NavLink>
          <NavLink to='/menues'>メニュー</NavLink>
          <NavLink to='/cooking'>レシピ集</NavLink>
          <NavLink to='/mypage'>設定</NavLink>
        </div>
      )}
    </header>
  );
};
