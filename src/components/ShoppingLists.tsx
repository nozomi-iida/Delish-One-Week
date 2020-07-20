import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces/state';
import { IMenu } from '../interfaces/menues';
import { Typography } from '@material-ui/core';
import { IMaterial } from '../interfaces/favorites';

export default () => {
  const menues = useSelector((state: IState) => state.menues)
  return (
    <>
      {menues.map((menu: IMenu, index: number) => (
        <div key={menu.id}>
          <Typography variant="h5">{index + 1}日目</Typography>
          <ul>
            {menu.materials.map((material: IMaterial) => (
              <div key={material.materialNum}>
                {material.materialName !== '' && 
                  <li>
                    <input type="checkbox"/>
                    <span>{material.materialName}:{material.materialWeight}{material.materialUnit}</span>
                  </li>
                }
              </div>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}