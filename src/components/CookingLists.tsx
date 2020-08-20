import React, { useState, useEffect } from 'react';
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
import { ListItem, ListItemText, CardActionArea } from '@material-ui/core';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Footer from '../components/Footer';

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
  cardActions: {
    textAlign: 'center',
    display: 'block',
  },
}));

const RAKUTEN_API_KEY = process.env.REACT_APP_RAKUTEN_API_KEY;

export default function CookingLists() {
  const classes = useStyles();
  const {id} = useParams();
  const [recipes, setRecipes] = useState([]);

  function renderRow(props: ListChildComponentProps,) {
    const { index, style, data } = props;
    
    return (
      <ListItem button style={style} key={index} disabled divider dense>
        <ListItemText primary={`${data[index]}`} />
      </ListItem>
    );
  }

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
    <>
      <Container component='main'>
        <CssBaseline />
        <div className={classes.cardGrid}>
          <Grid container spacing={4}>
            {recipes.map((recipe: any) => (
              <Grid item key={recipe.recipeId} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardActionArea>
                    <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer">
                      <CardMedia
                        className={classes.cardMedia}
                        image={recipe.foodImageUrl}
                        title="Image title"
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {recipe.recipeTitle}
                        </Typography>
                      </CardContent>
                    </a>
                  </CardActionArea>
                  <CardActions className={classes.cardActions}>
                    <FixedSizeList
                      height={150}
                      width='100%'
                      itemSize={30}
                      itemCount={recipe.recipeMaterial.length}
                      itemData={recipe.recipeMaterial}
                    >
                      {renderRow}
                    </FixedSizeList>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Container>
      <Footer pageValue={2}/>
    </>
  );
};