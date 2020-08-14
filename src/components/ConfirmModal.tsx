import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from '../interfaces/state';
import { IFavorite } from '../interfaces/favorites';
import { fireStore } from '../firebase/firebase';
import { AuthStore } from '../stores/AuthStore';
import { editMenu } from '../actions/menues';
import { IMenu } from '../interfaces/menues';
import { green } from '@material-ui/core/colors';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 350,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  btn: {
    backgroundColor: green[600],
    '&:hover': {
      backgroundColor: green[400],
    },
    color: '#fff',
  },
}));

interface IProps {
  favorite: IFavorite,
  selectedMenu: IMenu
};

export default function SimpleModal({ onClick, favorite, selectedMenu }: any) {
  // console.log(onClick);
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const favorites = useSelector((state: IState) => state.favorites);
  const user = useContext(AuthStore);
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleYesClick = () => {
    if (favorite !== undefined) {
      onClick(favorite);
    } else {
      onClick();
    }
    setOpen(false);
  };

  const onChoiceClick = (favorite: IFavorite) => {
    fireStore
      .collection('users')
      .doc(`${user.uid}`)
      .collection('menues')
      .doc(`${selectedMenu.id}`)
      .update({
        foodName: favorite.foodName,
        foodImg: favorite.foodImg,
        materials: favorite.materials,
      })
      .then(() => {
        dispatch(
          editMenu(selectedMenu.id, {
            foodName: favorite.foodName,
            foodImg: favorite.foodImg,
            materials: favorite.materials,
          })
        );
      });
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {onClick !== undefined ? (
        favorite === undefined ? (
          <div>
            <h2 id='simple-modal-title'>本当に再表示しますか？</h2>
            <div style={{textAlign: 'center', marginTop: '10px'}}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleYesClick}
                className={classes.btn}
                style={{marginRight: '10px'}}
              >
                はい
              </Button>
              <Button variant='contained' color='primary' onClick={handleClose}>
                いいえ
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h2 id='simple-modal-title'>本当に削除しますか？</h2>
            <div style={{textAlign: 'center', marginTop: '10px'}}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleYesClick}
                className={classes.btn}
                style={{marginRight: '10px'}}
              >
                はい
              </Button>
              <Button variant='contained' color='primary' onClick={handleClose}>
                いいえ
              </Button>
            </div>
          </div>
        )
      ) : (
        <ul>
          {favorites.map((favorite: IFavorite) => (
            <li key={favorite.id}>
              <span>{favorite.foodName}</span>
              <button onClick={() => onChoiceClick(favorite)}>選択</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <React.Fragment>
      {onClick !== undefined ? (
          <Button
            variant='contained'
            color='primary'
            type='button'
            onClick={handleOpen}
            className={classes.btn}
          >
            {favorite === undefined ? '表示する' : '削除する'}
          </Button>
      ) : (
        <Button
          variant='contained'
          type='button'
          onClick={handleOpen}
        >
          選択する
        </Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
    </React.Fragment>
  );
};
