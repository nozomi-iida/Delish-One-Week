import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { green } from '@material-ui/core/colors';
import {
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useForm } from 'react-hook-form';
import firebase from '../firebase/firebase';
import { useHistory, Link, Redirect } from 'react-router-dom';
import { AuthStore } from '../stores/AuthStore';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: green[400],
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
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

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();
  const history = useHistory();
  const [signInErr, setSignInErr] = useState('');
  const user = useContext(AuthStore);
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = handleSubmit(({ email, password }) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        history.push('/');
        console.log('log in!');
      })
      .catch(function (error) {
        var errorCode = error.code;
        if (errorCode === 'auth/wrong-password') {
          setSignInErr('パスワードが違います。');
        } else {
          setSignInErr('メールアドレスが違います。');
        }
        console.log(error);
      });
  });

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          ログイン
        </Typography>
        {signInErr && <p>{signInErr}</p>}
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
          <FormControl  variant='outlined' fullWidth required>
            <InputLabel>
              パスワード
            </InputLabel>
            <OutlinedInput
              type={showPassword ? 'text' : 'password'}
              name='password'
              autoComplete='current-password'
              inputRef={register}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    edge='end'
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={95}
            />
          </FormControl>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            className={classes.submit}
          >
            ログイン
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to='/signup' className={classes.linkFont}>
                パスワード忘れましたか？
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
  );
}
