import React, { useContext, useState } from 'react';
import { AuthStore } from '../stores/AuthStore';
import { Button, Link, Container } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import firebase from '../firebase/firebase';

type FormData = {
  userName: string;
  userEmail: string;
  nowPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default () => {
  const user = useContext(AuthStore);
  const [nameOpen, setNameOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [errMessage, setErrMessage] = useState('');
  const { register, handleSubmit } = useForm<FormData>();

  const onNameClick = () => {
    setNameOpen(true);
  };

  const onEmailClick = () => {
    setEmailOpen(true);
  };

  const onPasswordClick = () => {
    setPasswordOpen(true);
  };

  const onNameSubmit = handleSubmit(({ userName }) => {
    if (userName.trim() !== '') {
      user
        .updateProfile({
          displayName: userName,
        })
        .then(function () {
          window.location.reload();
        })
        .catch(function (error: any) {
          console.log('failed!');
        });
    } else {
      setNameOpen(false);
    }
  });

  const onEmailSubmit = handleSubmit(({ userEmail }) => {
    if (userEmail.trim() !== '') {
      user
        .updateEmail(userEmail)
        .then(function () {
          window.location.reload();
          console.log('success!');
        })
        .catch(function (error: any) {
          console.log(error); //ユーザーが再度ログインしないと変更できない場合の文を作る
          setErrMessage('メールアドレスが正しくありません。');
        });
    } else {
      setEmailOpen(false);
    }
  });

  const onPasswordSubmit = handleSubmit(
    ({ nowPassword, newPassword, confirmPassword }) => {
      const credentials = firebase.auth.EmailAuthProvider.credential(
        user.email,
        nowPassword
      );
      if (nowPassword.trim() !== '') {
        user
          .reauthenticateWithCredential(credentials)
          .then(function () {
            if (newPassword === confirmPassword) {
              user
                .updatePassword(newPassword)
                .then(function () {
                  window.location.reload();
                  console.log('passwrod update!');
                })
                .catch(function (error: any) {
                  console.log(error);
                });
            } else {
              setErrMessage('パスワードが違います。');
            }
          })
          .catch(function (error: any) {
            setErrMessage('パスワードが違います。');
            console.log(error);
          });
      } else {
        setPasswordOpen(false);
      }
    }
  );

  return (
    <Container component='main'>
      {errMessage !== '' && <p>{errMessage}</p>}
      <p>
        {user.displayName}{' '}
        {!nameOpen && (
          <Button variant='contained' color='primary' onClick={onNameClick}>
            変更する
          </Button>
        )}
      </p>
      {nameOpen && (
        <form onSubmit={onNameSubmit}>
          <input name='userName' ref={register} />
          <Button type='submit' variant='contained' color='primary'>
            変更する
          </Button>
        </form>
      )}
      <p>
        {user.email}{' '}
        {!emailOpen && (
          <Button variant='contained' color='primary' onClick={onEmailClick}>
            変更する
          </Button>
        )}
      </p>
      {emailOpen && (
        <form onSubmit={onEmailSubmit}>
          <input name='userEmail' ref={register} />
          <Button type='submit' variant='contained' color='primary'>
            変更する
          </Button>
        </form>
      )}
      <Link href='#' color='inherit' onClick={onPasswordClick}>
        パスワードを変更する
      </Link>
      {passwordOpen && (
        <form onSubmit={onPasswordSubmit}>
          <div>
            <label>現在のパスワード</label>
            <input name='nowPassword' ref={register} />
          </div>
          <div>
            <label>新しいパスワード</label>
            <input name='newPassword' ref={register} />
          </div>
          <div>
            <label>新しいパスワード（確認用）</label>
            <input name='confirmPassword' ref={register} />
          </div>
          <Button type='submit' variant='contained' color='primary'>
            変更する
          </Button>
        </form>
      )}
    </Container>
  );
};
