import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Container, Checkbox, Button, Typography, Box } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces/state';
import { IMenu } from '../interfaces/menues';
import { IMaterial } from '../interfaces/favorites';
import Footer from '../components/Footer';
import { green } from '@material-ui/core/colors';
import favorites from '../reducers/favorites';
import { fireStore } from '../firebase/firebase';
import { AuthStore } from '../stores/AuthStore';
import { Link } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  btn: {
    backgroundColor: green[600],
    '&:hover': {
      backgroundColor: green[400],
    },
    color: '#fff',
  },
  checkbox: {
    color: '#43a047!important',
  },
  returnBtn: {
    '&:hover': {
      textDecoration: 'underline',
    }
  },
});

interface IBuyList {
  materialName: string;
  materialNum: string;
  materialUnit: string;
  count: number;
  checked: boolean;
}

export default function DenseTable() {
  const classes = useStyles();
  const menues = useSelector((state: IState) => state.menues);
  const user = useContext(AuthStore);
  const materialLists: IBuyList[] = [];
  const [buyLists, setBuyLists] = useState<IBuyList[]>();
  
  useEffect(() => {
    menues.map((menu: IMenu) => {
      return menu.materials.map((material: IMaterial) => {
        return materialLists.push({
          materialName: material.materialName,
          count: Number(material.materialWeight),
          materialUnit: material.materialUnit,
          materialNum: material.materialNum,
          checked: false,
        });
      });
    });

    materialLists.reduce((result: IBuyList[], current: IBuyList) => {
      const element = result.find(function (p: IBuyList) {
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
      setBuyLists(result);
      return result;
    }, []);
  }, [menues]);
  
  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(buyLists) {
      const NewBuyLists = buyLists.map((buyList: IBuyList) => {
        if(buyList.materialNum === e.target.name) {
          return {...buyList, checked: e.target.checked};
        } else {
          return buyList;
        };
      });
      setBuyLists(NewBuyLists);
    };
  };

  const onUpdateClick = () => {
    if(buyLists) {
      buyLists.map((buyList: IBuyList, index: number) => {
        fireStore
          .collection('users')
          .doc(`${user.uid}`)
          .collection('buyLists')
          .doc(`${index + 1}`)
          .set({
            materials: buyList,
          });
      });
    };
  };
  
  return (
    <>
      <Container component='main'>
        <Box display='flex' style={{marginBottom: '10px'}}>
          <Link to='/menues'><Button startIcon={<KeyboardBackspaceIcon />} className={classes.returnBtn} style={{marginRight: 30}}>戻る</Button></Link>
          <Typography variant='h6'>買い物リスト</Typography>
          {/* <Button variant='contained' className={classes.btn} onClick={onUpdateClick}>リストを更新する</Button> */}
        </Box>
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            size='small'
            aria-label='a dense table'
          >
            <TableBody>
              {buyLists && (
                <>
                  {buyLists.map((buyList: IBuyList) => (
                    <TableRow key={buyList.materialNum}>
                      <TableCell component='th' scope='row' style={{padding: 0}}>
                        <Checkbox name={buyList.materialNum} checked={buyList.checked} onChange={onCheckboxChange} classes={{checked: classes.checkbox}} />
                      </TableCell>
                      <TableCell align='right' style={{width: '62%', padding: 0}}>{buyList.materialName}</TableCell>
                      <TableCell align='right' style={{padding: '0 5px 0 0'}}>
                        {buyList.count}
                        {buyList.materialUnit}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer pageValue={1} />
    </>
  );
}
