import React, { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AuthStore } from '../stores/AuthStore';
import { fireStore } from '../firebase/firebase';
import { addFavorite } from '../actions/favorites';
import { v4 as uuid } from 'uuid';
import { Fab } from '@material-ui/core';
import { IFavorite } from '../interfaces/favorites';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const RAKUTEN_API_KEY = process.env.REACT_APP_RAKUTEN_API_KEY;

export default function CookingLists() {
  const classes = useStyles();
  const {id} = useParams();
  const [recipes, setRecipes] = useState([]);
  const favorites = useSelector((state: any) => state.favorites)
  const user = useContext(AuthStore);
  const dispatch = useDispatch();
  const [created_at] = useState(new Date().valueOf());

  const fetchData = () => {
    const url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&categoryId=${id}&applicationId=${RAKUTEN_API_KEY}`;

    Axios
      .get(url)
      .then(response => {
        setRecipes(response.data.result);
      })
      .catch(() => {
        console.log('通信に失敗しました');
    });
  };

  useEffect(() => {
    recipes.length === 0 && fetchData()
  }, []);

  const onFavClick = (recipe: any) => {
    const newMaterials: Array<any> = [];
    recipe.recipeMaterial.map((material: any) =>{
      newMaterials.push({
        materialNum: uuid(),
        materialName: material,
        checked: false,
      })
    });

    fireStore.collection('users').doc(`${user.uid}`).collection("favorites").add(
      {
        foodName: recipe.recipeTitle,
        foodImg: recipe.foodImageUrl,
        materials: newMaterials,
        created_at,
      }
    ).then((docRef) => {
      dispatch(addFavorite({
        id: docRef.id,
        foodName: recipe.recipeTitle,
        foodImg: recipe.foodImageUrl,
        materials: newMaterials,
        created_at,
      }));
    });
  };

  return (
    <Container component='main'>
      <CssBaseline />
      <div className={classes.cardGrid}>
        <Grid container spacing={4}>
          {recipes.map((recipe: any) => (
            <Grid item key={recipe.recipeId} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={recipe.foodImageUrl}
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {recipe.recipeTitle}
                  </Typography>
                  <Typography>
                    This is a media card. You can use this section to describe the content.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Fab size="small" color ={favorites.find((favorite: IFavorite) => favorite.foodName === recipe.recipeTitle) ? "secondary" : "default"} aria-label="add" onClick={() => onFavClick(recipe)}>
                    <FavoriteIcon />
                  </Fab>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
};