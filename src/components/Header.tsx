import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import firebase from '../firebase/firebase';
import { green } from '@material-ui/core/colors';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { AuthStore } from '../stores/AuthStore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      position: 'fixed',
      width: '100vw',
      color: '#fff',
      zIndex: 100,
      textAlign: 'center',
    },
    titleContainer: {
      backgroundColor: '#fff',
      color: green[400],
    },
    title: {
      fontWeight: 'bold',
      margin: '8px 5%',
      display: 'inline-block',
      fontFamily: 'serif, Roboto, Helvetica, sans-serif',
    },
    btn: {
      color: '#fff',
      backgroundColor: green[600],
      position: 'absolute',
      right: '5%',
      top: '30%',
      '&:hover': {
        backgroundColor: green[400],
      },
    },
    menuContainer: {
      backgroundColor: green[300],
      display: "flex",
      justifyContent: "space-around",
      padding: theme.spacing(1, 0),
      fontSize: '14px',
      lineHeight: '20px'
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
      <div className={classes.titleContainer}>
        <Link to='/'>
          <Typography variant='h2' component='h1' className={classes.title}>
            一週間の献立表
          </Typography>
        </Link>
        {user && (
          <Button
            startIcon={<ExitToAppIcon />}
            className={classes.btn}
            onClick={onLogOutClick}
          >
            ログアウト
          </Button>
        )}

      </div>
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
