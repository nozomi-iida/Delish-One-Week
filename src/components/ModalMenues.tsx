import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces/state';
import { IFavorite } from '../interfaces/favorites';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal({ onClick, favorite }: any) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const favorites = useSelector((state: IState) => state.favorites);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleYesClick = () => {
    if(favorite !== undefined) {
      onClick(favorite);
    } else {
      onClick();
    };
    setOpen(false);
  };

  const onChoiceClick = (favorite: IFavorite) => {
    
    setOpen(false);
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {onClick !== undefined ?
        (favorite === undefined ?
          (<div>
            <h2 id="simple-modal-title">本当に再表示しますか？</h2>
            <Button variant="contained" color="primary" onClick={handleYesClick} >はい</Button>
            <Button variant="contained" color="primary" onClick={handleClose}>いいえ</Button>
          </div>) :
          (<div>
            <h2 id="simple-modal-title">本当に削除しますか？</h2>
            <Button variant="contained" color="primary" onClick={handleYesClick} >はい</Button>
            <Button variant="contained" color="primary" onClick={handleClose}>いいえ</Button>
          </div>)
        ) :
        (<ul>
          {favorites.map((favorite: IFavorite) => (
              <li key={favorite.id}>
                <span>{favorite.foodName}</span>
                <button onClick={()=>onChoiceClick(favorite)}>選択</button> 
              </li>
          ))}
        </ul>)
      }
    </div>
  );

  return (
    <div>
      {onClick !== undefined ?
        (favorite === undefined ? 
          (<Button variant="contained" color="primary" type="button" onClick={handleOpen}>
            表示する
          </Button>) : 
          (<Button  type="button" variant="contained" color="primary" onClick={handleOpen}>
            削除する
          </Button> )
        ) : (
          <Button variant="contained" color="primary" type="button" onClick={handleOpen}>
            選択する
          </Button>
        )
      }
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
