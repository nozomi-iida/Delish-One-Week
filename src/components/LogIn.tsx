import * as React from "react";
import clsx from 'clsx';
import { useForm } from "react-hook-form";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { InputLabel, FormControl, Input, InputAdornment, IconButton, Button, Typography } from "@material-ui/core";
import firebase from '../firebase/firebase';
import { useHistory, Redirect, Link } from "react-router-dom";
import { AuthStore } from "../stores/AuthStore";

interface FormData {
  email: string;
  password: string;
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [signInErr, setSignInErr] = React.useState('');
  const history = useHistory();
  const user = React.useContext(AuthStore);

  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit = handleSubmit(({ email, password }) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        history.push('/')
        console.log("log in!")
      })
      .catch(function(error) {
        var errorCode = error.code;
        if (errorCode === 'auth/wrong-password') {
          setSignInErr('パスワードが違います。');
        } else {
          setSignInErr('メールアドレスが違います。');
        }
        console.log(error);
      });
  }); 

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  if (user) {
    return <Redirect to='/addFavorite' />
  }

  return (
    <>
      <Typography variant="h4" >ログインする</Typography>
      <form onSubmit={onSubmit}>
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
        <Button type="submit" variant="contained" color="primary">ログイン</Button>
      </form>
      { signInErr && <p>{signInErr}</p>}
      <p>アカウントを持っていませんか？</p>
      <Link to="/signup">登録画面へ</Link>
    </>
  );
}