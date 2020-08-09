import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Container, Checkbox } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces/state';
import { IMenu } from '../interfaces/menues';
import { IMaterial } from '../interfaces/favorites';

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
});

interface IGroup {
  materialName: string;
  materialNum: string;
  materialUnit: string;
  count: number;
  checked: boolean;
}

export default function DenseTable() {
  const classes = useStyles();

  const menues = useSelector((state: IState) => state.menues);
  const materialLists: IGroup[] = [];
  menues.map((menu: IMenu) => {
    menu.materials.map((material: IMaterial) => {
      materialLists.push({
        materialName: material.materialName,
        count: Number(material.materialWeight),
        materialUnit: material.materialUnit,
        materialNum: material.materialNum,
        checked: false,
      });
    });
  });

  const group = materialLists.reduce((result: IGroup[], current: IGroup) => {
    const element = result.find(function (p: IGroup) {
      return p.materialName === current.materialName;
    });
    if (element) {
      element.count = element.count + current.count;
    } else {
      result.push({
        materialName: current.materialName,
        count: current.count,
        materialUnit: current.materialUnit,
        materialNum: current.materialNum,
        checked: false,
      });
    }
    return result;
  }, []);

  return (
    <Container component='main'>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size='small'
          aria-label='a dense table'
        >
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>買い物リスト</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {group.map((materialList: IGroup) => (
              <TableRow key={materialList.materialNum}>
                <TableCell component='th' scope='row'>
                  <Checkbox />
                </TableCell>
                <TableCell align='right'>{materialList.materialName}</TableCell>
                <TableCell align='right'>
                  {materialList.count}
                  {materialList.materialUnit}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
