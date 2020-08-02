import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container } from '@material-ui/core';
import { Link } from 'react-router-dom';

const RAKUTEN_API_KEY = process.env.REACT_APP_RAKUTEN_API_KEY;

interface ILargeCategory {
  parentCategoryId: string
  categoryId: string,
  categoryName: string,
  categoryUrl: string,
};

interface ICategory {
  parentCategoryId: string
  categoryId: string,
  categoryName: string,
  categoryUrl: string,
};

interface ICategories {
  large: ILargeCategory[] 
  medium: ICategory[] 
  small: ICategory[];
}

export default () => {
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
    <Container component='main'>
      {selectedCategory.map((recipe: ICategory) => (
        <span key={recipe.categoryId}>
          {recipe.parentCategoryId ? (
            <Link
              to={`cookingLists/${recipe.parentCategoryId}-${recipe.categoryId}`}
            >
              <Button variant='contained' color='primary'>
                {recipe.categoryName}
              </Button>
            </Link>
          ) : (
            <Button
              variant='contained'
              color='primary'
              onClick={() => onLargeRecipeClick(recipe.categoryId)}
            >
              {recipe.categoryName}
            </Button>
          )}
        </span>
      ))}
    </Container>
  );
};
