import React, { useState, useContext, useEffect } from 'react';
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
import { useHistory, Link } from 'react-router-dom';
import { editFavorite } from '../actions/favorites';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { IMaterial, IFavorite } from '../interfaces/favorites';
import { v4 as uuid } from 'uuid';
import RemoveIcon from '@material-ui/icons/Remove';
import FoodImageSetting from './atoms/FoodImageSetting';
import { green } from '@material-ui/core/colors';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

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
  returnBtn: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  btn: {
    backgroundColor: green[600],
    '&:hover': {
      backgroundColor: green[400],
    },
    color: '#fff',
  },
}));

interface IBlob {
  size: number;
  type: string;
}

export default (props: any) => {
  const classes = useStyles();
  const favorites = useSelector((state: any) => state.favorites); //anyやめたい
  const selectedFavorite: IFavorite = favorites.find(
    (element: IFavorite) => element.id === props.match.params.id
  );
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
      materialUnit: '',
      checked: false,
    },
  ]);
  const history = useHistory();
  const dispatch = useDispatch();
  const [metadata] = useState({ contentType: 'image/jpeg' });
  const [blob, setBlob] = useState<any>();

  useEffect(() => {
    if (selectedFavorite) {
      setFoodName(selectedFavorite.foodName);
      setMaterials(selectedFavorite.materials);
      setConfirmImg(selectedFavorite.foodImg);
    }
  }, [selectedFavorite]);

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
  };
  const onPlusClick = () => {
    const addMaterial = {
      materialNum: uuid(),
      materialName: '',
      materialWeight: '',
      materialUnit: '',
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

  console.log(blob);
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
                .doc(`${selectedFavorite.id}`)
                .update({
                  foodName,
                  foodImg: foodImgUrl,
                  materials: newMaterials,
                  created_at,
                })
                .then(() => {
                  dispatch(
                    editFavorite(selectedFavorite.id, {
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
        .doc(`${selectedFavorite.id}`)
        .update({
          foodName,
          foodImg: confirmImg,
          materials: newMaterials,
          created_at,
        })
        .then(() => {
          dispatch(
            editFavorite(selectedFavorite.id, {
              foodName,
              foodImg: confirmImg,
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
      <Link to='/'><Button startIcon={<KeyboardBackspaceIcon />} className={classes.returnBtn}>戻る</Button></Link>
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
                  type='number'
                  name={material.materialNum}
                  value={material.materialWeight}
                  onChange={onMaterialWeightChange}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  type='text'
                  name={material.materialNum}
                  value={material.materialUnit}
                  onChange={onMaterialUnitChange}
                  required
                />
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
          <Button type='submit' variant='contained' className={classes.btn}>
            登録
          </Button>
        </div>
      </form>
    </Container>
  );
};
