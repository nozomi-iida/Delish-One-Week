import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces/state';
import { IMenu } from '../interfaces/menues';
import { Typography, Container } from '@material-ui/core';
import { IMaterial } from '../interfaces/favorites';

interface IMaterialList {
  materialName: string
  checked: boolean
}

interface IGroup {
  materialName: string,
  checked: boolean,
  count: number,
}

export default () => {
  const menues = useSelector((state: IState) => state.menues)

  const materialLists: IMaterialList[] = [];
  menues.map((menu: IMenu) => {
    menu.materials.map((material: IMaterial) => {
      materialLists.push({materialName: material.materialName, checked: false});
    });
  });

  const group = materialLists.reduce((result: IGroup[], current: IMaterialList) => {
    const element = result.find(function (p: IGroup) {
      return p.materialName === current.materialName
    });
    if (element) {
      element.count ++; // count
    } else {
      result.push({
        materialName: current.materialName,
        checked: false,
        count: 1,
      });
    }
    return result;
  }, []);

  return (
    <Container component='main'>
      <ul>
        {group.map((el: any, index: number) => (
          <div key={index}>
            <p><input type="checkbox" />{el.materialName}<span>{el.count}</span></p>
          </div>
        ))}
      </ul>
    </Container>
  );
};
