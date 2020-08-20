import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Hidden,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
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
      backgroundColor: '#F7F7F7',
      color: green[400],
    },
    title: {
      fontWeight: 'bold',
      margin: '8px 5%',
      display: 'inline-block',
      fontFamily: 'serif, Roboto, Helvetica, sans-serif',
      fontSize: '3.75rem',
      [theme.breakpoints.down('xs')]: {
        fontSize: '40px',
      }
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

  return (
    <header className={classes.header}>
      <div className={classes.titleContainer}>
        <Link to='/'>
          <Typography variant='h2' component='h1' className={classes.title}>
            一週間の献立表
          </Typography>
        </Link>
      </div>
      <Hidden xsDown>
        {user && (
            <div className={classes.menuContainer}>
              <NavLink to='/'>お気に入り</NavLink>
              <NavLink to='/menues'>メニュー</NavLink>
              <NavLink to='/cooking'>レシピ集</NavLink>
              <NavLink to='/mypage'>設定</NavLink>
            </div>
        )}
      </Hidden>
    </header>
  );
};
