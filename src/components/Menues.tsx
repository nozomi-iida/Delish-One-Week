import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Card, CardActionArea, CardMedia, CardContent, CardActions } from '@material-ui/core';
import ModalMenues from './ModalMenues';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces/state';
import { IMenu } from '../interfaces/menues';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    card: {
      maxWidth: 345,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    media: {
      height: 140,
    },
    container: {
      justifyContent: 'center',
    },
  }),
);

export default function SimpleAccordion() {
  const classes = useStyles();
  const menues = useSelector((state: IState) => state.menues);

  return (
    <>
      <ModalMenues />
      <div className={classes.root}>
      {menues.map((menu: IMenu, index: number) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Day 1</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.container}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="/static/images/cards/contemplative-reptile.jpg"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <ModalMenues />
              </CardActions>
            </Card>
          </AccordionDetails>
        </Accordion>
      ))}
      </div>
    </>
  );
};
