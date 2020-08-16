import React, { useContext } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Container,
  ListItem,
  ListItemText,
  Box,
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
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import noImg from '../images/noimage.png'; 
import Footer from '../components/Footer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
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
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: 345,
    },
    cardMedia: {
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      flexGrow: 1,
    },
    cardActions: {
      textAlign: 'right',
      display: 'block',
    },
  })
);

export default function SimpleAccordion() {
  const classes = useStyles();
  const menues = useSelector((state: IState) => state.menues);
  const favorites = useSelector((state: IState) => state.favorites);
  const user = useContext(AuthStore);
  const dispatch = useDispatch();
  // const [newFavoritesArray, setNewFavoritesArray] = useState(menues);

  function renderRow(props: ListChildComponentProps) {
    const { index, style, data } = props;

    return (
      <ListItem button style={style} key={index} disabled divider dense>
        <ListItemText primary={`${data.materials[index].materialName}`} />
      </ListItem>
    );
  };

  const shuffleFavorites = () => {
    let newFavoritesArray = []
    if(favorites.length <= 7) {
      const randomArray: IFavorite[] = favorites.map((a: IFavorite) => {return {weight: Math.random(), value:a}}).sort((a, b) => {
        return a.weight - b.weight
      }).map((a: any) => {
        console.log(a);
        return a.value
      }).slice(0, 7);
      newFavoritesArray = randomArray;
    } else {
      for (let i = 0; i < 7; i++) {
        let num = Math.floor(Math.random() * favorites.length);
        newFavoritesArray.push(favorites[num]);
      }
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
        return fireStore
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
    };
  };

  return (
    <>
      <Container component='main'>
        <Box display='flex' justifyContent='space-between'>
          <ModalMenues onClick={shuffleFavorites} />
          <Link to='/shoppinglists'>
            <Button variant='contained' color='primary'>
              買い物リスト
            </Button>
          </Link>
        </Box>
        <div className={classes.root}>
          {menues.map((menu: IMenu, index: number) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography className={classes.heading}>
                  <span style={{fontWeight: 'bold'}}>{index + 1}日目</span>{menu.foodName}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.container}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={menu.foodImg === '' ? noImg : menu.foodImg}
                    title='Image title'
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant='h5' component='h2'>
                      {menu.foodName}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <FixedSizeList
                      height={150}
                      width='100%'
                      itemSize={30}
                      itemCount={menu.materials.length}
                      itemData={menu}
                    >
                      {renderRow}
                    </FixedSizeList>
                    <ModalMenues selectedMenu={menu} />
                  </CardActions>
                </Card>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  );
}
