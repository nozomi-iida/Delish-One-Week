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
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useForm } from 'react-hook-form';
import { Redirect, Link } from 'react-router-dom';
import { AuthStore } from '../stores/AuthStore';
import firebase from '../firebase/firebase';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
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

export default function SignUp() {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();
  const [signUpErr, setSignUpErr] = React.useState('');
  const user = useContext(AuthStore);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  const handleChange = () => {
    setSignUpErr('');
  }

  const onSubmit = handleSubmit(
    ({ name, email, password, confirmPassword }) => {
      if (password === confirmPassword) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            firebase
              .auth()
              .currentUser?.updateProfile({ displayName: name })
              .then(() => {
                console.log('Sing up!!');
              });
          })
          .catch(error => {
            const errorCode = error.code;
            if (errorCode === 'auth/weak-password') {
              setSignUpErr('パスワードは6文字以上にしてください。');
            } else {
              setSignUpErr('必要事項を記入してください。');
            }
            console.log(error);
          });
      } else {
        setSignUpErr('パスワードが違います。');
      }
    }
  );

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
            新規登録
          </Typography>
          {signUpErr && <p>{signUpErr}</p>}
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name='name'
                  variant='outlined'
                  required
                  fullWidth
                  id='name'
                  label='名前'
                  autoFocus
                  inputRef={register}
                  autoComplete='user-name'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  autoComplete='email'
                  required
                  fullWidth
                  id='email'
                  label='メールアドレス'
                  name='email'
                  inputRef={register}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl variant='outlined' fullWidth required>
                  <InputLabel>パスワード</InputLabel>
                  <OutlinedInput
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    inputRef={register}
                    autoComplete='current-password'
                    onChange={handleChange}
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
              </Grid>
              <Grid item xs={12}>
                <FormControl variant='outlined' fullWidth required>
                  <InputLabel>パスワード（確認用）</InputLabel>
                  <OutlinedInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    autoComplete='confirm-password'
                    inputRef={register}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle confirmPassword visibility'
                          onClick={handleClickShowConfirmPassword}
                          edge='end'
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={175}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              新規登録
            </Button>
            <Grid container justify='flex-end'>
              <Grid item>
                <Link to='/login' className={classes.linkFont}>
                  ログイン画面へ
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
