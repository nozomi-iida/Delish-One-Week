import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, makeStyles, Button, Modal, createStyles, Theme } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { IFavorite } from '../interfaces/favorites';
import { AuthStore } from '../stores/AuthStore';
import firebase,  { fireStore } from '../firebase/firebase';
import { removeFavorite } from '../actions/favorites';
import Loading from './Loading';
import { IState } from '../interfaces/state';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

export default () => {
  const classes = useStyles();
  const user = useContext(AuthStore)
  const favorites = useSelector((state: IState) => state.favorites)
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDeleteClick = (favorite: any) => {
    if(favorite.foodImg === 'https://firebasestorage.googleapis.com/v0/b/delish-one-week.appspot.com/o/noimage.png?alt=media&token=7d10ebb8-eca8-4795-8129-0ae6118b8944') {
      fireStore.collection('users').doc(`${user.uid}`).collection('favorites').doc(`${favorite.id}`).delete().then(() => {
        dispatch(removeFavorite(favorite.id))
        setOpen(false);
      });
    } else {
      firebase.storage().refFromURL(favorite.foodImg).delete().then(() => {
        fireStore.collection('users').doc(`${user.uid}`).collection('favorites').doc(`${favorite.id}`).delete().then(() => {
          dispatch(removeFavorite(favorite.id))
          setOpen(false);
        });
      })
    }
  };

  const body = (favorite: any) => (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">削除しても良いですか？</h2>
      <Button variant="contained" color="primary" onClick={() => onDeleteClick(favorite)}>はい</Button>:
      <Button variant="contained" color="primary" onClick={handleClose}>いいえ</Button>
    </div>
  );

  if(favorites.length !== 0) {
    return (
      <div>
        {favorites.map((favorite: IFavorite, index: number) => (
          <div key={index}>
            <Card className={classes.root}>
              <Link to={`/detail/${favorite.id}`}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={favorite.foodImg}
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {favorite.foodName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
                <CardActions>
                  <Button variant="contained" color="primary" onClick={handleOpen}>削除</Button>
                </CardActions>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                {body(favorite)}
              </Modal>
            </Card>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <>
        <Loading />
      </>
    );
  };
};