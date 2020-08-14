import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IMaterial, IFavorite } from '../interfaces/favorites';
import { IState } from '../interfaces/state';
import { Container } from '@material-ui/core';

export default (props: any) => {
  const selectedFavorite = useSelector((state: IState) =>
    state.favorites.find(
      (favorite: IFavorite) => favorite.id === props.match.params.id
    )
  );
  console.log(selectedFavorite);
  const selectedMenu = useSelector((state: IState) =>
    state.menues.find((menu: any) => menu.id === props.match.params.id)
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
