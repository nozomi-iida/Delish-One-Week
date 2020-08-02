import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  makeStyles,
  createStyles,
  Theme,
  Button,
  Container,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { IFavorite } from '../interfaces/favorites';
import { AuthStore } from '../stores/AuthStore';
import firebase, { fireStore } from '../firebase/firebase';
import { removeFavorite } from '../actions/favorites';
import { IState } from '../interfaces/state';
import ConfirmModal from './ConfirmModal';

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
  })
);

export default () => {
  const classes = useStyles();
  const user = useContext(AuthStore);
  const favorites = useSelector((state: IState) => state.favorites);
  const dispatch = useDispatch();

  const onDeleteClick = (favorite: IFavorite) => {
    if (
      favorite.foodImg ===
      'https://firebasestorage.googleapis.com/v0/b/delish-one-week.appspot.com/o/noimage.png?alt=media&token=7d10ebb8-eca8-4795-8129-0ae6118b8944'
    ) {
      fireStore
        .collection('users')
        .doc(`${user.uid}`)
        .collection('favorites')
        .doc(`${favorite.id}`)
        .delete()
        .then(() => {
          dispatch(removeFavorite(favorite.id));
        });
    } else {
      firebase
        .storage()
        .refFromURL(favorite.foodImg)
        .delete()
        .then(() => {
          fireStore
            .collection('users')
            .doc(`${user.uid}`)
            .collection('favorites')
            .doc(`${favorite.id}`)
            .delete()
            .then(() => {
              dispatch(removeFavorite(favorite.id));
            });
        });
    }
  };

  if (favorites.length !== 0) {
    return (
      <Container component='main'>
        <Link to='addFavorite'>
          <Button variant='contained' color='primary'>
            追加
          </Button>
        </Link>
        {favorites.map((favorite: IFavorite) => (
          <div key={favorite.id}>
            <Card className={classes.root}>
              <Link to={`/detail/${favorite.id}`}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={favorite.foodImg}
                    title='Contemplative Reptile'
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='h2'>
                      {favorite.foodName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
              <CardActions>
                <ConfirmModal onClick={onDeleteClick} favorite={favorite} />
              </CardActions>
            </Card>
          </div>
        ))}
      </Container>
    );
  } else {
    return (
      <Container component='main'>
        <Link to='addFavorite'>
          <Button variant='contained' color='primary'>
            追加
          </Button>
        </Link>
      </Container>
    );
  }
};
