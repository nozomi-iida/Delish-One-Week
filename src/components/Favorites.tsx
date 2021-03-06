import React, { useContext } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSelector, useDispatch } from 'react-redux';
import { AuthStore } from '../stores/AuthStore';
import firebase, { fireStore } from '../firebase/firebase';
import { IFavorite } from '../interfaces/favorites';
import { IState } from '../interfaces/state';
import ConfirmModal from './ConfirmModal';
import { removeFavorite } from '../actions/favorites';
import { Link } from 'react-router-dom';
import {
  Button,
  IconButton,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import noImg from '../images/noimage.png';
import Footer from '../components/Footer';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    padding: '10px',
  },
  btn: {
    backgroundColor: green[600],
    '&:hover': {
      backgroundColor: green[400],
    },
    color: '#fff',
  },
  cardActions: {
    textAlign: 'right',
    display: 'block',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default function Favorites() {
  const classes = useStyles();
  const user = useContext(AuthStore);
  const favorites = useSelector((state: IState) => state.favorites);
  const dispatch = useDispatch();

  function renderRow(props: ListChildComponentProps) {
    const { index, style, data } = props;

    return (
      <ListItem button style={style} key={index} disabled divider dense>
        <ListItemText primary={`${data.materials[index].materialName}`} />
      </ListItem>
    );
  }

  const onDeleteClick = (favorite: IFavorite) => {
    favorite.foodImg.includes('firebasestorage') &&
      firebase
        .storage()
        .refFromURL(favorite.foodImg)
        .delete()
        .then(() => {});
        
    fireStore
      .collection('users')
      .doc(`${user.uid}`)
      .collection('favorites')
      .doc(`${favorite.id}`)
      .delete()
      .then(() => {
        dispatch(removeFavorite(favorite.id));
      });
  };

  return (
    <>
      <Container component='main'>
        <div>
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'center' }}>
              <Link to='addFavorite'>
                <IconButton aria-label='add'>
                  <AddIcon fontSize='large' />
                </IconButton>
              </Link>
            </Grid>
            {favorites.map((favorite: IFavorite) => (
              <Grid item key={favorite.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={favorite.foodImg === '' ? noImg : favorite.foodImg}
                    title='Image title'
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      {favorite.foodName}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <FixedSizeList
                      height={150}
                      width='100%'
                      itemSize={30}
                      itemCount={favorite.materials.length}
                      itemData={favorite}
                    >
                      {renderRow}
                    </FixedSizeList>
                    <div className={classes.buttonContainer} style={{margin: '5px 0 0'}}>
                      <Link to={`/edit/${favorite.id}`}>
                        <Button variant='contained' className={classes.btn}>
                          編集する
                        </Button>
                      </Link>
                      <ConfirmModal onClick={onDeleteClick} favorite={favorite} />
                    </div>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Container>
      <Footer pageValue={0} />
    </>
  );
}
