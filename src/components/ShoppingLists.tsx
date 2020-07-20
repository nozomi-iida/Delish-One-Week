import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces/state';

export default () => {
  const menues = useSelector((state: IState) => state.menues)
  console.log(menues);
  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}