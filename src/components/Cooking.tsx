import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  makeStyles,
  Theme,
  Divider,
  Grid,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { green } from '@material-ui/core/colors';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const RAKUTEN_API_KEY = process.env.REACT_APP_RAKUTEN_API_KEY;

interface ILargeCategory {
  parentCategoryId: string;
  categoryId: string;
  categoryName: string;
  categoryUrl: string;
}

interface ICategory {
  parentCategoryId: string;
  categoryId: string;
  categoryName: string;
  categoryUrl: string;
}

interface ICategories {
  large: ILargeCategory[];
  medium: ICategory[];
  small: ICategory[];
}

const useStyles = makeStyles((theme: Theme) => ({
  btn: {
    backgroundColor: green[400],
    borderColor: green[500],
    color: '#fff',
    margin: '5px',
    '&:hover': {
      backgroundColor: green[200],
    },
    border: 'solid 1px',
  },
}));

export default () => {
  const classes = useStyles();
  const [category, setCategory] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  console.log(category);

  const fetchDataAction = () => {
    const url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&applicationId=${RAKUTEN_API_KEY}`;

    axios
      .get(url)
      .then(response => {
        setCategory(response.data.result);
        setSelectedCategory(response.data.result.large);
      })
      .catch(() => {
        console.log('通信に失敗しました');
      });
  };

  useEffect(() => {
    category.length === 0 && fetchDataAction();
    // eslint-disable-next-line
  }, []);

  const onLargeRecipeClick = (id: string) => {
    const mediumRecipes = category.medium.filter((recipe: ICategory) => {
      return recipe.parentCategoryId === id;
    });
    setSelectedCategory(mediumRecipes);
  };

  return (
    <Grid container component='main' spacing={3}>
      {selectedCategory.map((recipe: ICategory) => (
        <Grid item key={recipe.categoryId} xs={12} sm={6} >
          <Link
            to={
              recipe.parentCategoryId &&
              `cookingLists/${recipe.parentCategoryId}-${recipe.categoryId}`
            }
          >
            <Button
              size='large'
              onClick={() => onLargeRecipeClick(recipe.categoryId)}
              // endIcon={<ChevronRightIcon />}
              fullWidth={true}
            >
              {recipe.categoryName}
            </Button>
            <Divider light={false} />
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};
