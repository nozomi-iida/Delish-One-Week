import React, { useState, useContext } from 'react';
import { TextField, Button, IconButton } from '@material-ui/core';
import firebase, { fireStore } from '../firebase/firebase';
import { AuthStore } from '../stores/AuthStore';
import { useHistory } from 'react-router-dom';
import { addFavorite } from '../actions/favorites';
import { useDispatch } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { v4 as uuid } from 'uuid';
import RemoveIcon from '@material-ui/icons/Remove';
import { IMaterial } from '../interfaces/favorites';

export default () => {
  const user = useContext(AuthStore);
  const [foodName, setFoodName] = useState('');
  const [foodImg, setFoodImg] = useState('');
  const [foodImgFile, setFoodImgFile] = useState<any>('');
  const [created_at] = useState(new Date().valueOf());
  const [addFromErr, setAddFromErr] = useState('');
  const [materials, setMaterials] = useState([
    {
      materialNum: uuid(),
      materialName: '',
      checked: false,
    },
  ]);
  const history = useHistory();
  const dispatch = useDispatch();

  const onFoodNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoodName(e.target.value);
  };

  const onFoodImgChange = (e: any) => {
    setFoodImgFile(e.target.files[0]);
    const files: FileList | any = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      const render = new FileReader();
      render.onload = (e: any) => {
        setFoodImg(e.target.result);
      };
      render.readAsDataURL(file);
    } else {
      setFoodImg('');
    }
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

  const onPlusClick = () => {
    const addMaterial = {
      materialNum: uuid(),
      materialName: '',
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

    if (foodName.trim() !== '' && foodImg.trim() !== '') {
      let foodImgUrl: string = '';
      firebase
        .storage()
        .ref()
        .child(`${user.uid}/${created_at}.png`)
        .put(foodImgFile)
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
    } else if (foodName.trim() !== '') {
      const foodImg =
        'https://firebasestorage.googleapis.com/v0/b/delish-one-week.appspot.com/o/FEmEUOuERESVg52Jixei2FjDKws1%2Fnoimg.png?alt=media&token=926ff900-e8e8-42e4-aa0d-92c043a5e876';
      fireStore
        .collection('users')
        .doc(`${user.uid}`)
        .collection('favorites')
        .add({ foodName, foodImg, materials: newMaterials, created_at })
        .then(docRef => {
          dispatch(
            addFavorite({
              id: docRef.id,
              foodName,
              foodImg,
              materials: newMaterials,
              created_at,
            })
          );
          history.push('/');
        });
    } else {
      setAddFromErr('料理名を記入してください。');
    }
  };
  return (
    <>
      {addFromErr && <p>{addFromErr}</p>}
      <form onSubmit={onSubmit}>
        <TextField
          label='料理名'
          name='foodName'
          value={foodName}
          onChange={onFoodNameChange}
        />
        {foodImg && <img src={foodImg} alt='' />}
        <input
          type='file'
          accept='image/png, image/jpeg'
          name='foodImg'
          onChange={onFoodImgChange}
        />
        <table>
          <thead>
            <tr>
              <th>材料名</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material: any, index: number) => (
              <tr key={index}>
                <td>
                  <input
                    type='text'
                    name={material.materialNum}
                    value={material.materialName}
                    onChange={onMaterialNameChange}
                  />
                  <IconButton
                    color='primary'
                    aria-label='remove material'
                    onClick={() => onRemoveClick(material.materialNum)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <IconButton aria-label='settings' onClick={onPlusClick}>
          <AddCircleIcon />
        </IconButton>
        <Button type='submit' variant='contained' color='primary'>
          登録
        </Button>
      </form>
    </>
  );
};
