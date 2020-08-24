import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Hidden } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    width: '100vw',
    position: 'fixed',
    bottom: '0',
    borderTop: 'solid 1px #E0E0E0',
  },
  select: {
    color: '#43a047!important',
  },
  border: {
    borderLeft: 'solid 1px #E0E0E0',
    borderRight: 'solid 1px #E0E0E0',
  },
  borderMenu: {
    borderRight: 'solid 1px #E0E0E0',
  },
});

interface Props {
  pageValue: number;
}

export default function SimpleBottomNavigation({ pageValue }: Props) {
  const classes = useStyles();
  const [value, setValue] = useState(pageValue);
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    
    if (newValue === 0) {
      history.push('/');
    } else if (newValue === 1) {
      history.push('/menues');
    } else if (newValue === 2) {
      history.push('/cooking');
    } else {
      history.push('/mypage');
    }
  };

  return (
    <Hidden smUp>
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction
          label='お気に'
          icon={<StarIcon />}
          classes={{ selected: classes.select }}
        />
        <BottomNavigationAction
          label='献立'
          icon={<LocalDiningIcon />}
          classes={{ selected: classes.select }}
          className={classes.border}
        />
        <BottomNavigationAction
          label='レシピ'
          icon={<ImportContactsIcon />}
          classes={{ selected: classes.select }}
          className={classes.borderMenu}
        />
        <BottomNavigationAction
          label='設定'
          icon={<SettingsIcon />}
          classes={{ selected: classes.select }}
        />
      </BottomNavigation>
    </Hidden>
  );
}
