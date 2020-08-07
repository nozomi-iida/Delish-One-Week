import React, { useState, useContext } from 'react'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import { Button, makeStyles, Modal, Grid, Slider } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import firebase from '../../firebase/firebase';
import { AuthStore } from '../../stores/AuthStore';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    width: "315px",
    padding: "16px 10px 24px"
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
  btn: {
    color: green[600],
    borderColor: green[600],
    marginBottom: '10px',
  },
}));

interface IBlob {
  size: number,
  type: string,
};

export default ({setConfirmImg, setBlob}: any) => {
  const classes = useStyles();
  const [image, setImage] = useState<File>();
  const [modalStyle] = useState(getModalStyle);
  const [editRef, setEditRef] = useState<any>();
  const [metadata] = useState({ contentType: 'image/jpeg' });
  const user = useContext(AuthStore);
  const [open, setOpen] = useState(false);
  const [imageWidth, setImageWidth] = useState(12);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDrop = (dropped: File[]) => { 
    setImage(dropped[0]);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setImageWidth(newValue);
  };

  const onClick = () => {
    if(editRef) {
      editRef.getImageScaledToCanvas().toBlob((blob: IBlob) => {
        setBlob(blob);
      });
      const url = editRef.getImageScaledToCanvas().toDataURL();
      setConfirmImg(url);
      setOpen(false);
    };
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
        <Dropzone
          onDrop={handleDrop}
          noClick
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              {image && 
                <>
                  <AvatarEditor 
                    ref={setEditRef}
                    width={240} 
                    height={150} 
                    scale={imageWidth / 10}
                    image={image} 
                  />
                  <Grid container spacing={2}>
                    <Grid item>
                      <p>-</p>
                    </Grid>
                    <Grid item xs>
                      <Slider value={imageWidth} onChange={handleChange} min={10} max={20} />
                    </Grid>
                    <Grid item>
                      <p>+</p>
                    </Grid>
                  </Grid>
                </>
              }
              <input 
                {...getInputProps()}  
                style={{display: "block"}} 
              />
            </div>
          )}
        </Dropzone>
      <Button variant="outlined" className={classes.btn} onClick={onClick}>決定</Button>
    </div>
  )


  return (
    <>
      <Button variant="outlined" className={classes.btn} onClick={handleOpen}>画像を設定する</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  )
}