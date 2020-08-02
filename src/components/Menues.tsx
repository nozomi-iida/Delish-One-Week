import React, { useContext } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import ModalMenues from './ConfirmModal';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from '../interfaces/state';
import { IMenu } from '../interfaces/menues';
import { IFavorite } from '../interfaces/favorites';
import { fireStore } from '../firebase/firebase';
import { AuthStore } from '../stores/AuthStore';
import { addMenues, updateMenues } from '../actions/menues';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    card: {
      maxWidth: 345,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    media: {
      height: 140,
    },
    container: {
      justifyContent: 'center',
    },
  })
);

export default function SimpleAccordion() {
  const classes = useStyles();
  const menues = useSelector((state: IState) => state.menues);
  const favorites = useSelector((state: IState) => state.favorites);
  const user = useContext(AuthStore);
  const dispatch = useDispatch();

  const shuffleFavorites = () => {
    // let newFavoritesArray = favorites;
    // newFavoritesArray = newFavoritesArray.map((a: any) => {return {weight: Math.random(), value:a}}).sort((a, b) => {
    //   return a.weight - b.weight
    // }).map((a: any) => {
    //   return a.value
    // }).slice(0, 7);

    const newFavoritesArray = [];

    for (let i = 0; i < 7; i++) {
      let num = Math.floor(Math.random() * favorites.length);
      newFavoritesArray.push(favorites[num]);
    }

    if (menues[0]) {
      newFavoritesArray.map((favorite: IFavorite, index: number) => {
        return fireStore
          .collection('users')
          .doc(`${user.uid}`)
          .collection('menues')
          .doc(`day${index + 1}`)
          .update({
            foodName: favorite.foodName,
            foodImg: favorite.foodImg,
            materials: favorite.materials,
          })
          .then(() => {
            dispatch(
              updateMenues(`day${index + 1}`, {
                foodName: favorite.foodName,
                foodImg: favorite.foodImg,
                materials: favorite.materials,
              })
            );
          });
      });
    } else {
      newFavoritesArray.map((favorite: IFavorite, index: number) => {
        fireStore
          .collection('users')
          .doc(`${user.uid}`)
          .collection('menues')
          .doc(`day${index + 1}`)
          .set({
            foodName: favorite.foodName,
            foodImg: favorite.foodImg,
            materials: favorite.materials,
          })
          .then(() => {
            dispatch(addMenues({ ...favorite, id: `day${index + 1}` }));
          });
      });
    }
  };

  return (
    <>
      <ModalMenues onClick={shuffleFavorites} />
      <Link to='/shoppinglists'>
        <Button variant='contained' color='primary'>
          買い物リスト
        </Button>
      </Link>
      <div className={classes.root}>
        {menues.map((menu: IMenu, index: number) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography className={classes.heading}>
                {index + 1}日目{menu.foodName}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.container}>
              <Card className={classes.card}>
                <Link to={`/detail/${menu.id}`}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={menu.foodImg}
                      title='Contemplative Reptile'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        {menu.foodName}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='textSecondary'
                        component='p'
                      >
                        Lizards are a widespread group of squamate reptiles,
                        with over 6,000 species, ranging across all continents
                        except Antarctica
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
                <CardActions>
                  <ModalMenues selectedMenu={menu} />
                </CardActions>
              </Card>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
}
