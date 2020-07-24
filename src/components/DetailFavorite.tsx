import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IMaterial, IFavorite } from '../interfaces/favorites';
import Loading from './Loading';
import { IState } from '../interfaces/state';

export default (props: any) => {
  const selectedFavorite = useSelector((state: IState) => state.favorites.find((favorite: IFavorite) => favorite.id === props.match.params.id));
  const selectedMenu = useSelector((state: IState) => state.menues.find((menu: any) => menu.id === props.match.params.id));
  if(selectedFavorite) {
    return (
      <div>
        <h1>{selectedFavorite.foodName}</h1>
        <img src={selectedFavorite.foodImg} alt=""/>
        {selectedFavorite.materials.map((material: IMaterial, index: number) => (
          material.materialName.trim() !== '' &&  <li key={index}>{material.materialName}</li>
        ))}
        <Link to={`/edit/${selectedFavorite.id}`}>編集する</Link>
      </div>
    );
  } else if (selectedMenu) {
    return (
      <div>
        <h1>{selectedMenu.foodName}</h1>
        <img src={selectedMenu.foodImg} alt=""/>
        {selectedMenu.materials.map((material: IMaterial, index: number) => (
          material.materialName.trim() !== '' &&  <li key={index}>{material.materialName}</li>
        ))}
      </div>
    )
  }else {
    return (
      <>
        <Loading />
      </>
    )
  }
}