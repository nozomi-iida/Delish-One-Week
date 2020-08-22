import React, { useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import { Button, makeStyles, Modal, Grid, Slider } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

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

interface IBlob {
  size: number
  type: string
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

interface IProps {
  setConfirmImg: (url: string) => void;
  setBlob: (blob: Blob) => void;
 }

export default ({setConfirmImg, setBlob}: IProps) => {
  const classes = useStyles();
  const [image, setImage] = useState<File>();
  const [modalStyle] = useState(getModalStyle);
  const [editRef, setEditRef] = useState<AvatarEditor | null>(null);
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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number | number[]) => {
    if(!Array.isArray(newValue)) {
      setImageWidth(newValue);
    }
  };

  const onClick = () => {
    if(editRef) {
      editRef.getImageScaledToCanvas().toBlob((blob: Blob | null) => {
        if(blob !== null) {
          setBlob(blob);
        }
      });
      const url = editRef.getImageScaledToCanvas().toDataURL();
      setConfirmImg(url);
      setOpen(false);
    };
  };

  console.log(editRef);

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
                    ref={ref => {setEditRef(ref)}}
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