import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { IMaterial, IFavorite } from '../interfaces/favorites';
import { IState } from '../interfaces/state';
import { Container } from '@material-ui/core';
import { IMenu } from '../interfaces/menues';

export default () => {
  const {id} = useParams();
  const selectedFavorite = useSelector((state: IState) =>
    state.favorites.find(
      (favorite: IFavorite) => favorite.id === id
    )
  );
  const selectedMenu = useSelector((state: IState) =>
    state.menues.find((menu: IMenu) => menu.id === id)
  );

  if (selectedFavorite) {
    return (
      <Container component='main'>
        <h1>{selectedFavorite.foodName}</h1>
        <img src={selectedFavorite.foodImg} alt='' />
        {selectedFavorite.materials.map(
          (material: IMaterial, index: number) =>
            material.materialName.trim() !== '' && (
              <li key={index}>{material.materialName}</li>
            )
        )}
        <Link to={`/edit/${selectedFavorite.id}`}>編集する</Link>
      </Container>
    );
  } else if (selectedMenu) {
    return (
      <Container component='main'>
        <h1>{selectedMenu.foodName}</h1>
        <img src={selectedMenu.foodImg} alt='' />
        {selectedMenu.materials.map(
          (material: IMaterial, index: number) =>
            material.materialName.trim() !== '' && (
              <li key={index}>{material.materialName}</li>
            )
        )}
      </Container>
    );
  }
};
