import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, makeStyles, createStyles, Theme, Fab} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { fireStore } from '../firebase/firebase';
import { AuthStore } from '../stores/AuthStore';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite } from '../actions/favorites';

const RAKUTEN_API_KEY = process.env.REACT_APP_RAKUTEN_API_KEY;

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
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

export default () => {
  const classes = useStyles();
  const {id} = useParams();
  const [recipes, setRecipes] = useState([]);
  const favorites = useSelector((state: any) => state.favorites)
  const [clicked, setClicked] = useState('');
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
    <div>
      {recipes.map((recipe: any) => (
        <div key={recipe.recipeId}>
          <Card className={classes.root}>
            <a href={recipe.recipeUrl}  target="_blank" rel="noopener noreferrer">
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={recipe.foodImageUrl}
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {recipe.recipeTitle}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </a>
            <CardActions>
              <Fab size="small" color ={clicked ? "secondary" : "default"} aria-label="add" className={classes.margin} onClick={() => onFavClick(recipe)}>
                <FavoriteIcon />
              </Fab>
            </CardActions>
          </Card>
        </div>
      ))}
    </div>
  );
};