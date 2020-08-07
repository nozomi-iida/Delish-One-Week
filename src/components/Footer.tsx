import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Hidden } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router-dom';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles({
  root: {
    width: '100vw',
    position: 'fixed',
    bottom: '0',
  },
  select: {
    color: '#43a047!important',
  },
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory();

  if(value === 0) {
    history.push('/');
  } else if(value === 1) {
    history.push('/menues');
  } else if(value === 2) {
    history.push('/cooking');
  } else {
    history.push('/mypage');
  } 

  return (
    <Hidden smUp>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.root}
      > 
          <BottomNavigationAction label="お気に" icon={<StarIcon />} classes={{selected: classes.select}} />
          <BottomNavigationAction label="メニュー" icon={<LocalDiningIcon />} classes={{selected: classes.select}} />
          <BottomNavigationAction label="レシピ" icon={<ImportContactsIcon />} classes={{selected: classes.select}} />

          <BottomNavigationAction label="設定" icon={<SettingsIcon />} classes={{selected: classes.select}} />

      </BottomNavigation>
    </Hidden>
  );
}
