import React, { useState } from 'react';
import {
  Container,
  TextField,
  CssBaseline,
  makeStyles,
  Typography,
  Avatar,
  Button,
  Grid,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { green } from '@material-ui/core/colors';
import firebase from '../firebase/firebase';
import { Link } from 'react-router-dom';

interface FormData {
  email: string;
}

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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: green[400],
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: '#fff',
    backgroundColor: green[600],
    '&:hover': {
      backgroundColor: green[400],
    },
  },
  linkFont: {
    color: green[600],
  },
}));

export default () => {
  const classes = useStyles();
  const { register, handleSubmit } = useForm<FormData>();
  const [successMes, setSuccessMes] = useState('');

  const onSubmit = handleSubmit(({ email }) => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setSuccessMes('パスワード再設定のメールを送信しました。');
      })
      .catch(error => {
        console.log(error);
      });
  });
  return (
    <div className='authContainer'>
      <div className='bg'></div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            パスワードを再設定する
          </Typography>
          {successMes && <p>{successMes}</p>}
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='メールアドレス'
              name='email'
              autoComplete='email'
              autoFocus
              inputRef={register}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              再設定メールを送信する
            </Button>
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
          </form>
        </div>
      </Container>
    </div>
  );
};
