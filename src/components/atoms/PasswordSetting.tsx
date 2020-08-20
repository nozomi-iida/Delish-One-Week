import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, TextField, Typography, Link, Box } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase/firebase';
import { AuthStore } from '../../stores/AuthStore';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    width: "290px",
    padding: "16px 10px 24px"
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    color: '#fff',
    backgroundColor: green[600],
    '&:hover': {
      backgroundColor: green[400],
    },
  },
  text: {
    color: '#000',
  },
}));

type FormData = {
  nowPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SimpleModal() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const user = useContext(AuthStore);
  const { register, handleSubmit } = useForm<FormData>();
  const [errMessage, setErrMessage] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const onSubmit = ({nowPassword, newPassword, confirmPassword}: FormData)  => {
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, nowPassword);
    user.reauthenticateWithCredential(credentials).then(() => {
      if(newPassword === confirmPassword) {
        user.updatePassword(newPassword).then(function() {
          window.location.reload();
        }).catch(function(error: Error) {
          console.log(error)
        });
      } else {
        setErrMessage('パスワードが違います。');
      };
    }).catch((err: Error) => {
      setErrMessage('パスワードが違います。');
      console.log(err);
    });
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {errMessage && <Typography component="p">{errMessage}</Typography>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant="outlined"
          type="password"
          margin="normal"
          required
          fullWidth
          id="nowPassword"
          name="nowPassword"
          autoComplete="nowPassword"
          inputRef={register} 
          label="現在のパスワード"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          type="password"
          required
          fullWidth
          id="newPassword"
          name="newPassword"
          autoComplete="newPassword"
          label="新しいパスワード"
          inputRef={register} 
        />
        <TextField
          variant="outlined"
          margin="normal"
          type="password"
          required
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="confirmPassword"
          label="新しいパスワード（確認）"
          inputRef={register} 
        />
        <Button className={classes.button} type="submit">
          パスワードを変更する
        </Button>
      </form>
    </div>
  );

  return (
    <div>
      <Link href="#" className={classes.text} onClick={handleOpen}>
        <Box display='flex' alignItems='center' style={{margin: '10px 0'}}>
          <VpnKeyIcon />
          <Typography variant='h6'>
            パスワードを変更する
          </Typography>

        </Box>
      </Link>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
