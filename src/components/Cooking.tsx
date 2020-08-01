import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const RAKUTEN_API_KEY = process.env.REACT_APP_RAKUTEN_API_KEY;

export default () => {
  const [category, setCategory] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

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
  }, []);

  const onLargeRecipeClick = (id: string) => {
    const mediumRecipes = category.medium.filter((recipe: any) => {
      return recipe.parentCategoryId === id;
    });
    setSelectedCategory(mediumRecipes);
  };

  return (
    <>
      <div>
        {selectedCategory.map((recipe: any) => (
          <div key={recipe.categoryId}>
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
          </div>
        ))}
      </div>
    </>
  );
};
