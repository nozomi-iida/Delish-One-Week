import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Container,
  makeStyles,
  Theme,
  Grid,
  MenuItem,
} from '@material-ui/core';
import firebase, { fireStore } from '../firebase/firebase';
import { AuthStore } from '../stores/AuthStore';
import { useHistory } from 'react-router-dom';
import { addFavorite } from '../actions/favorites';
import { useDispatch } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { IMaterial } from '../interfaces/favorites';
import { v4 as uuid } from 'uuid';
import RemoveIcon from '@material-ui/icons/Remove';
import FoodImageSetting from './atoms/FoodImageSetting';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    border: 'solid 2px',
    borderColor: green[600],
    backgroundColor: '#F7F7F7',
    borderRadius: '4px',
    padding: '20px',
  },
  foodName: {
    width: '200px',
    marginBottom: '10px',
    display: 'block',
  },
  materialName: {
    width: '100%',
  },
  materialUnit: {
    width: '100%',
  },
}));

interface IBlob {
  size: number;
  type: string;
}

export default () => {
  const classes = useStyles();
  const user = useContext(AuthStore);
  const [foodName, setFoodName] = useState('');
  const [confirmImg, setConfirmImg] = useState('');
  const [created_at] = useState(new Date().valueOf());
  const [addFromErr, setAddFromErr] = useState('');
  const [materials, setMaterials] = useState([
    {
      materialNum: uuid(),
      materialName: '',
      materialWeight: '',
      materialUnit: '本',
      checked: false,
    },
  ]);
  const history = useHistory();
  const dispatch = useDispatch();
  const [metadata] = useState({ contentType: 'image/jpeg' });
  const [blob, setBlob] = useState<any>();

  const onFoodNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoodName(e.target.value);
  };

  const onMaterialNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaterials = materials.map(material => {
      if (material.materialNum === e.target.name) {
        return { ...material, materialName: e.target.value };
      } else {
        return material;
      }
    });
    setMaterials(newMaterials);
  };

  const onMaterialWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaterials = materials.map((material: IMaterial) => {
      if (
        material.materialNum === e.target.name &&
        e.target.value.match(/^\d*(\.\d{0,2})*(\/\d{0,1})*$/)
      ) {
        return { ...material, materialWeight: e.target.value };
      } else {
        return material;
      }
    });
    setMaterials(newMaterials);
  };

  const onMaterialUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaterials = materials.map((material: any) => {
      if (material.materialNum === e.target.name) {
        return { ...material, materialUnit: e.target.value };
      } else {
        return material;
      }
    });
    setMaterials(newMaterials);
    console.log(newMaterials);
  };

  const onPlusClick = () => {
    const addMaterial = {
      materialNum: uuid(),
      materialName: '',
      materialWeight: '',
      materialUnit: '本',
      checked: false,
    };
    const newmaterial = [...materials, addMaterial];
    setMaterials(newmaterial);
    setAddFromErr('');
  };

  const onRemoveClick = (id: string) => {
    const newMaterials = materials.filter((material: IMaterial) => {
      return material.materialNum !== id;
    });
    setMaterials(newMaterials);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMaterials = materials.filter((material: IMaterial) => {
      return material.materialName;
    });

    if (blob) {
      let foodImgUrl = '';
      firebase
        .storage()
        .ref()
        .child(`${user.uid}/${created_at}.png`)
        .put(blob, metadata)
        .then(snapshot => {
          snapshot.ref
            .getDownloadURL()
            .then(downloadURL => {
              foodImgUrl = downloadURL;
            })
            .then(() => {
              fireStore
                .collection('users')
                .doc(`${user.uid}`)
                .collection('favorites')
                .add({
                  foodName,
                  foodImg: foodImgUrl,
                  materials: newMaterials,
                  created_at,
                })
                .then(docRef => {
                  dispatch(
                    addFavorite({
                      id: docRef.id,
                      foodName,
                      foodImg: foodImgUrl,
                      materials: newMaterials,
                      created_at,
                    })
                  );
                  history.push('/');
                });
            });
        });
    } else {
      fireStore
        .collection('users')
        .doc(`${user.uid}`)
        .collection('favorites')
        .add({
          foodName,
          foodImg: '',
          materials: newMaterials,
          created_at,
        })
        .then(docRef => {
          dispatch(
            addFavorite({
              id: docRef.id,
              foodName,
              foodImg: '',
              materials: newMaterials,
              created_at,
            })
          );
          history.push('/');
        });
    }
  };
  return (
    <Container component='main'>
      {addFromErr && <p>{addFromErr}</p>}
      <form onSubmit={onSubmit} className={classes.form}>
        <TextField
          label='料理名'
          name='foodName'
          value={foodName}
          onChange={onFoodNameChange}
          className={classes.foodName}
          required
          autoFocus
        />

        {confirmImg && (
          <div>
            <img src={confirmImg} alt='' />
          </div>
        )}
        <FoodImageSetting setConfirmImg={setConfirmImg} setBlob={setBlob} />
        <div>
          <Grid container style={{ textAlign: 'center' }}>
            <Grid item xs={6}>
              <p>材料名</p>
            </Grid>
            <Grid item xs={2}>
              <p>量</p>
            </Grid>
            <Grid item xs={2}>
              <p>単位</p>
            </Grid>
          </Grid>
          {materials.map((material: IMaterial) => (
            <Grid key={material.materialNum} container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  type='text'
                  name={material.materialNum}
                  value={material.materialName}
                  onChange={onMaterialNameChange}
                  className={classes.materialName}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  type='text'
                  name={material.materialNum}
                  value={material.materialWeight}
                  onChange={onMaterialWeightChange}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  name={material.materialNum}
                  onChange={onMaterialUnitChange}
                  select
                  value={material.materialUnit}
                  className={classes.materialUnit}
                >
                  <MenuItem value='本'>本</MenuItem>
                  <MenuItem value='g'>g</MenuItem>
                  <MenuItem value='束'>束</MenuItem>
                  <MenuItem value='袋'>袋</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  color='primary'
                  aria-label='remove material'
                  onClick={() => onRemoveClick(material.materialNum)}
                >
                  <RemoveIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </div>
        <div>
          <IconButton aria-label='settings' onClick={onPlusClick}>
            <AddCircleIcon />
          </IconButton>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button type='submit' variant='contained' color='primary'>
            登録
          </Button>
        </div>
      </form>
    </Container>
  );
};
