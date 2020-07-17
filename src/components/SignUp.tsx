import * as React from "react";
import clsx from 'clsx';
import { useForm } from "react-hook-form";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { InputLabel, FormControl, Input, InputAdornment, IconButton, Button, Typography } from "@material-ui/core";
import  firebase from '../firebase/firebase';
import { Redirect, Link } from "react-router-dom";
import { AuthStore } from "../stores/AuthStore";

interface FormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '25ch',
    },
  }),
);

export default () => {
  const classes = useStyles();
  const user = React.useContext(AuthStore);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const [signUpErr, setSignUpErr] = React.useState('');
  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit = handleSubmit(({ name, email, password, passwordConfirm }) => {
    if(password === passwordConfirm) {
      firebase.auth().createUserWithEmailAndPassword( email, password)
        .then(() => {
          firebase
            .auth()
            .currentUser?.updateProfile({ displayName: name })
            .then(() => {
              console.log(firebase.auth().currentUser);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/weak-password') {
            setSignUpErr('The password is too weak.');
          } else {
            setSignUpErr(errorMessage);
          }
          console.log(error);
        });
    } else {
      setSignUpErr("パスワードが違います。");
    }
  }); 

  if (user) {
    return <Redirect to='/' />
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };
  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm)
  };

  return (
    <>
      <Typography variant="h4" >アカウントを作成する</Typography>
      <form onSubmit={onSubmit}>
        <div className={classes.margin}>
          <TextField label="名前" name="name" inputRef={register} />
        </div>
        <div className={classes.margin}>
          <TextField label="メールアドレス" name="email" inputRef={register} />
        </div>
        <div className={classes.margin}>
          <FormControl className={clsx(classes.margin, classes.textField)}>
            <InputLabel htmlFor="standard-adornment-password">パスワード</InputLabel>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              inputRef={register}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div className={classes.margin}>
          <FormControl className={clsx(classes.margin, classes.textField)}>
            <InputLabel htmlFor="standard-adornment-password">パスワード（確認）</InputLabel>
            <Input
              type={showPasswordConfirm ? 'text' : 'password'}
              name="passwordConfirm"
              inputRef={register}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordConfirm}
                  >
                    {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <Button type="submit" variant="contained" color="primary">登録</Button>
      </form>
      { signUpErr ?? <p>{signUpErr}</p>}
      <p>すでにアカウントをお持ちですか？</p>
      <Link to='/login'>ログイン画面へ</Link>
    </>
  );
};
