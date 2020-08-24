import React, { useContext } from 'react';
import {
  Typography,
  Container,
  makeStyles,
  CssBaseline,
  Grid,
  Divider,
} from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import { green } from '@material-ui/core/colors';
import { AuthStore } from '../stores/AuthStore';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    padding: theme.spacing(3),
    borderRadius: '4px',
  },
  linkFont: {
    color: green[600],
  },
  fontStyle: {
    fontSize: 16,
    lineHeight: '35px'
  },
  title: {
    color: green[600],
    fontWeight: 'bold',
    fontSize: 20,
  }
}));


export default () => {
  const classes = useStyles();
  const user = useContext(AuthStore);

  if (user) {
    return <Redirect to='/' />;
  }
  return (
    <div className='authContainer'>
      <div className='bg'></div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Typography className={classes.fontStyle}>
            <span className={classes.title}>一週間の献立表</span>はあなたが登録したレシピから一週間の献立を作ってくれるアプリです。
            <br />
            一週間の献立を考える手間が減り、買い物リストが簡単に作れます♪
          </Typography>
          <Divider style={{width: '100%', margin: 10}} />
          <Grid container>
            <Grid item xs>
              <Link to='/login' className={classes.linkFont}>
                ログイン
              </Link>
            </Grid>
            <Grid item>
              <Link to='/signup' className={classes.linkFont}>
                新規登録
              </Link>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};
