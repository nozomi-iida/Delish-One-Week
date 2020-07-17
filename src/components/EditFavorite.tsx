import React, { useState, useContext } from "react";
import { TextField, Button, IconButton } from "@material-ui/core";
import firebase, { fireStore } from '../firebase/firebase';
import { AuthStore } from "../stores/AuthStore";
import { useHistory, Redirect } from "react-router-dom";
import { editFavorite } from "../actions/favorites";
import { useDispatch, useSelector } from "react-redux";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { IMaterial, IFavorite } from "../interfaces/favorites";


export default (props: any) => {
  const favorites = useSelector((state: any) => state.favorites); //anyやめたい
  const favorite: IFavorite = favorites.find((element: IFavorite) => element.id === props.match.params.id);
  const user = useContext(AuthStore);
  const [foodName, setFoodName] = useState(favorite ? favorite.foodName : '');
  const [foodImg] = useState(favorite ? favorite.foodImg : '');
  const [foodImgFile, setFoodImgFile] = useState<any>('');
  const [previewFoodImg, setPreviewFoodImg] = useState(favorite ? favorite.foodImg : '');
  const [created_at] = useState(favorite ? favorite.created_at : new Date().valueOf());
  const [addFromErr, setAddFromErr] = useState('');
  const [materials, setMaterials] = useState(favorite? favorite.materials.map((material: IMaterial) => {
    return {
      materialNum: material.materialNum,
      materialName: material.materialName,
      materialWeight: material.materialWeight,
      materialUnit: material.materialUnit
    }
  }): [{
    materialNum: '1',
    materialName: '',
    materialWeight: '',
    materialUnit: '個'
  }]);
  const history = useHistory();
  const dispatch = useDispatch();
  const onFoodNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoodName(e.target.value);
  };

  const onFoodImgChange = (e: any) => {
    setFoodImgFile(e.target.files[0]);
    const files: FileList | any = e.target.files
    if(files.length > 0) {
      const file = files[0]
      const render = new FileReader();
      render.onload = (e: any) => {
        setPreviewFoodImg(e.target.result);
      };
      render.readAsDataURL(file);
    } else {
      setPreviewFoodImg('');
    };
  };

  const onMaterialNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaterials = materials.map((material: IMaterial) => {
      if(material.materialNum === e.target.name) {
        return {...material, materialName: e.target.value};
      } else {
        return material;
      };
    });
    setMaterials(newMaterials);
  }

  const onMaterialWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaterials = materials.map((material: any) => {
      if (material.materialNum === e.target.name && e.target.value.match(/^\d*(\.\d{0,2})*(\/\d{0,1})*$/)) {
        return {...material, materialWeight: e.target.value};
      } else {
        return material;
      };
    });
    setMaterials(newMaterials);
  };

  const onMaterialUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMaterials = materials.map((material: any) => {
      if (material.materialNum === e.target.name) {
        return {...material, materialUnit: e.target.value};
      } else {
        return material;
      };
    });
    setMaterials(newMaterials);
  };

  const onPlusClick = () => {
    const Num = materials.length + 1;
    const addMaterial = {
      materialNum: `${Num}`,
      materialName: '',
      materialWeight: '',
      materialUnit: '個'
    }
    const newmaterial = [...materials, addMaterial]
    setMaterials(newmaterial)
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(foodImg === 'https://firebasestorage.googleapis.com/v0/b/delish-one-week.appspot.com/o/noimage.png?alt=media&token=fbfc573e-6d3f-4a15-a0a0-6b07541567ac') {
      let foodImgUrl: string = ''
      firebase.storage().ref().child(`${user.uid}/${created_at}.png`).put(foodImgFile)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          foodImgUrl = downloadURL
        }).then(() => {
          fireStore.collection("users").doc(`${user.uid}`).collection("favorites").doc(`${favorite.id}`).update({foodName, foodImg: foodImgUrl, materials, created_at}).then(() => {
            dispatch(editFavorite(favorite.id, {foodName, foodImg: foodImgUrl, materials, created_at}))
            history.push('/');
          });
        });
      });
    } else if(foodImgFile === '') {
      fireStore.collection("users").doc(`${user.uid}`).collection("favorites").doc(`${favorite.id}`).update({foodName, foodImg, materials, created_at}).then(() => {
        dispatch(editFavorite(favorite.id, {foodName, foodImg, materials, created_at}))
        history.push('/');
      });
    } else if (foodName.trim() !== '' && foodImg !== '') {
      firebase.storage().refFromURL(foodImg).delete()
      let foodImgUrl: string = ''
      firebase.storage().ref().child(`${user.uid}/${created_at}.png`).put(foodImgFile)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          foodImgUrl = downloadURL
        }).then(() => {
          fireStore.collection("users").doc(`${user.uid}`).collection("favorites").doc(`${favorite.id}`).update({foodName, foodImg: foodImgUrl, materials, created_at}).then(() => {
            dispatch(editFavorite(favorite.id, {foodName, foodImg: foodImgUrl, materials, created_at}))
            history.push('/');
          });
        });
      });
    } else {
      setAddFromErr('料理名を記入してください。')
    };
  };
  if(favorites.length !== 0) {
    return (
      <>
        {addFromErr && <p>{addFromErr}</p>}
        <form onSubmit={onSubmit}>
        <TextField label="料理名" name="foodName" value={foodName} onChange={onFoodNameChange}  />
        {foodImg && <img src={previewFoodImg} alt=""/>}
        <input type="file" accept="image/png, image/jpeg" name="foodImg"  onChange={onFoodImgChange}  />
        <table>
          <thead>
              <tr>
                  <th>材料名</th>
                  <th>量</th>
                  <th>単位</th>
              </tr>
          </thead>
          <tbody>
            {materials.map((material: any, index: number) => (
              <tr key={index}>
                <td><input type="text" name={material.materialNum} value={material.materialName} onChange={onMaterialNameChange} /></td>
                <td><input type="text" name={material.materialNum} value={material.materialWeight} onChange={onMaterialWeightChange} /></td>
                <td>
                  <select name={material.materialNum} onChange={onMaterialUnitChange}>
                    <option value="個">個</option>
                    <option value="本">本</option>
                    <option value="g">g</option>
                    <option value="束">束</option>
                    <option value="袋">袋</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          <IconButton aria-label="settings" onClick={onPlusClick}>
            <AddCircleIcon />
          </IconButton>
          <Button type="submit" variant="contained" color="primary">
            登録
          </Button>
        </form>
      </>
    );
  } else {
    return <Redirect to='/' />
  };
};