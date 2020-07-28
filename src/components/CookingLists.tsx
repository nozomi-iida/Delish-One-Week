import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, makeStyles, createStyles, Theme} from '@material-ui/core';

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
  }),
);

export default () => {
  const classes = useStyles();
  const {id} = useParams();
  const [recipes, setRecipes] = useState([]);
  console.log(recipes);

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
            </CardActions>
          </Card>
        </div>
      ))}
    </div>
  )
}