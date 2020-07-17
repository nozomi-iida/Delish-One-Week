import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IMaterial } from '../interfaces/favorites';
import Loading from './Loading';
import { IState } from '../interfaces/state';

export default (props: any) => {
  const favorite = useSelector((state: IState) => state.favorites.find((favorite: any) => favorite.id === props.match.params.id));
  if(favorite) {
    return (
      <div>
        <h1>{favorite.foodName}</h1>
        <img src={favorite.foodImg} alt=""/>
        {favorite.materials.map((material: IMaterial, index: number) => (
          <li key={index}>{material.materialName}</li>
        ))}
        <Link to={`/edit/${favorite.id}`}>編集する</Link>
      </div>
    );
  } else {
    return (
      <>
        <Loading />
      </>
    )
  }
}