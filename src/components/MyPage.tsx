import React, { useContext, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  makeStyles,
  Theme,
  Button,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import firebase from '../firebase/firebase';
import PasswordSetting from './atoms/PasswordSetting';
import { AuthStore } from '../stores/AuthStore';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
};

interface IError {
  code: string;
  message: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  myPageContainer: {
    border: 'solid 2px',
    borderColor: green[600],
    backgroundColor: '#F7F7F7',
    borderRadius: '4px',
    padding: '10px',
    width: '288px',
    display: 'block',
    margin: '80px auto',
  },
  btn: {
    color: '#fff',
    backgroundColor: green[600],
    '&:hover': {
      backgroundColor: green[400],
    },
  },
  changeBtn: {
    color: green[600],
    borderColor: green[600],
  },
}));

export default () => {
  const classes = useStyles();
  const user = useContext(AuthStore);
  const { register, handleSubmit } = useForm<FormData>();
  const [errMessage, setErrMessage] = useState('');
  const [successMes, setSuccessMes] = useState('');

  const onLogOutClick = () => {
    firebase.auth().signOut();
    console.log('sign out');
  };

  const onSubmit = handleSubmit(({ name, email }) => {
    if (name.trim() !== '') {
      user
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          setSuccessMes('更新されました。')
        })
        .catch((error: IError) => {
          console.log('failed!');
        });
    }

    if (email.trim() !== '') {
      user
        .updateEmail(email)
        .then(() => {
          setSuccessMes('更新されました。')
        })
        .catch((err: IError) => {
          if (err.code === 'auth/requires-recent-login') {
            setErrMessage('再ログインする必要があります。');
          } else {
            setErrMessage('アドレスが正しくありません。');
          }
        });
    }
  });

  return (
    <Container component='main'>
      <div className={classes.myPageContainer}>
        <form onSubmit={onSubmit}>
          {successMes && <Typography align='center'>{successMes}</Typography>}
          <div>
            <Typography variant='h6'>名前</Typography>
            <TextField
              placeholder={user.displayName}
              fullWidth
              id='outlined-basic'
              variant='outlined'
              margin='dense'
              name='name'
              inputRef={register}
            />
          </div>
          <div>
            <Typography variant='h6'>メールアドレス</Typography>
            <TextField
              placeholder={user.email}
              fullWidth
              id='outlined-basic'
              variant='outlined'
              margin='dense'
              name='email'
              inputRef={register}
            />
          </div>
          {errMessage && <p>{errMessage}</p>}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Button
              type='submit'
              variant='outlined'
              className={classes.changeBtn}
            >
              変更する
            </Button>
          </div>
        </form>
        <PasswordSetting />
        <Button
          startIcon={<ExitToAppIcon />}
          className={classes.btn}
          onClick={onLogOutClick}
          fullWidth
        >
          ログアウト
        </Button>
      </div>
    </Container>
  );
};
