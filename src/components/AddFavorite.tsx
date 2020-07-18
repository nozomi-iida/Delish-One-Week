import React, { useState, useContext } from "react";
import { TextField, Button, IconButton } from "@material-ui/core";
import firebase, { fireStore } from '../firebase/firebase';
import { AuthStore } from "../stores/AuthStore";
import { useHistory } from "react-router-dom";
import { addFavorite } from "../actions/favorites";
import { useDispatch } from "react-redux";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { IMaterial } from "../interfaces/favorites";


export default () => {
  const user = useContext(AuthStore);
  const [foodName, setFoodName] = useState('');
  const [foodImg, setFoodImg] = useState('');
  const [foodImgFile, setFoodImgFile] = useState<any>('');
  const [created_at] = useState(new Date().valueOf());
  const [addFromErr, setAddFromErr] = useState('');
  const [materials, setMaterials] = useState([
    {
      materialNum: '1',
      materialName: '',
      materialWeight: '',
      materialUnit: '個'
    }
  ]);
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
        setFoodImg(e.target.result);
      };
      render.readAsDataURL(file);
    } else {
      setFoodImg('');
    };
  };

  const onMaterialNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaterials = materials.map((material) => {
      if(material.materialNum === e.target.name) {
        return {...material, materialName: e.target.value};
      } else {
        return material;
      };
    });
    setMaterials(newMaterials);
  }

  const onMaterialWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaterials = materials.map((material: IMaterial) => {
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
  console.log(materials);

  const onPlusClick = () => {
    const Num = materials.length;
    if(materials[Num - 1].materialName) {
      const addMaterial = {
        materialNum: `${Num + 1}`,
        materialName: '',
        materialWeight: '',
        materialUnit: '個'
      }
      const newmaterial = [...materials, addMaterial]
      setMaterials(newmaterial);
      setAddFromErr('')
    } else {
      setAddFromErr('材料名を教えてください。')
    };
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(foodName.trim() !== '' && foodImg.trim() !== '') {
      let foodImgUrl: string = ''
      firebase.storage().ref().child(`${user.uid}/${created_at}.png`).put(foodImgFile)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          foodImgUrl = downloadURL
        }).then(() => {
          fireStore.collection("users").doc(`${user.uid}`).collection("favorites").add({foodName, foodImg: foodImgUrl, materials, created_at}).then((docRef) => {
            dispatch(addFavorite({ id: docRef.id,foodName, foodImg: foodImgUrl, materials, created_at }));
            history.push('/');
          });
        });
      });
    } else if (foodName.trim() !== '') {
      const foodImg = "https://firebasestorage.googleapis.com/v0/b/delish-one-week.appspot.com/o/noimage.png?alt=media&token=7d10ebb8-eca8-4795-8129-0ae6118b8944";
      fireStore.collection("users").doc(`${user.uid}`).collection("favorites").add({foodName, foodImg, materials, created_at}).then((docRef) => {
        dispatch(addFavorite({id: docRef.id, foodName, foodImg, materials, created_at}));
        history.push('/');
      });
    } else {
      setAddFromErr('料理名を記入してください。')
    };
  };
  return (
    <>
      {addFromErr && <p>{addFromErr}</p>}
      <form onSubmit={onSubmit}>
      <TextField label="料理名" name="foodName" value={foodName} onChange={onFoodNameChange}  />
      {foodImg && <img src={foodImg} alt=""/>}
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
};