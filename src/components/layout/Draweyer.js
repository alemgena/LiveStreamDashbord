import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  ListItemText,
  makeStyles,
  Drawer,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import HomeIcon from '@material-ui/icons/Home';
import MovieIcon from '@material-ui/icons/Movie';
import SearchIcon from '@material-ui/icons/Search';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import TvIcon from '@material-ui/icons/Tv';
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from 'react-router';
const DrawerComponent = () => {
  const history = useHistory();
  const useStyles = makeStyles((theme) => ({
    drawerContainer: {
      background: 'black',
    },
    iconButtonContainer: {
      marginLeft: 'auto',
      color: 'white',
    },

    menuIconToggle: {
      fontSize: '3rem',
    },
    list: {
      backgroundColor: 'black',
    },
  }));
  const [openDrawer, setOpenDrawer] = useState(false);
  const Home = () => {
    setOpenDrawer(false);
    history.push('/');
  };
  const Movies = () => {
    setOpenDrawer(false);
    history.push('/movies');
  };
  const Treanding = () => {
    setOpenDrawer(false);
    history.push('/Treanding');
  };
  const TV_Serious = () => {
    setOpenDrawer(false);
    history.push('/series');
  };
  const Search = () => {
    setOpenDrawer(false);
    history.push('/search');
  };
  const Upload = () => {
    setOpenDrawer(false);
    history.push('/uploadVideo');
  };
  //Css
  const classes = useStyles();
  return (
    <>
      <Drawer
        style={{ width: '50%' }}
        anchor='left'
        classes={{ paper: classes.drawerContainer }}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        onOpen={() => setOpenDrawer(true)}
      >
        <List>
          <ListItem divider button onClick={Home}>
            <ListItemIcon>
              <ListItemText style={{ color: 'white' }}>
                <HomeIcon /> Home
              </ListItemText>
            </ListItemIcon>
          </ListItem>

          <ListItem divider button onClick={Treanding}>
            <ListItemIcon>
              <ListItemText style={{ color: 'white', marginTop:'10px' }}>
                <WhatshotIcon /> Treanding
              </ListItemText>
            </ListItemIcon>
          </ListItem>
          <ListItem divider button onClick={TV_Serious}>
            <ListItemIcon>
              <ListItemText style={{ color: 'white', marginTop:'10px'}}>
                <TvIcon /> TV_Serious{' '}
              </ListItemText>
            </ListItemIcon>
          </ListItem>
          <ListItem divider button onClick={Movies}>
            <ListItemIcon>
              <ListItemText style={{ color: 'white' , marginTop:'10px'}}>
                <MovieIcon /> Movies
              </ListItemText>
            </ListItemIcon>
          </ListItem>

          <ListItem divider button onClick={Search}>
            <ListItemIcon>
              <ListItemText style={{ color: 'white', marginTop:'10px' }}>
                {' '}
                <SearchIcon /> Search
              </ListItemText>
            </ListItemIcon>
          </ListItem>
          <ListItem divider button onClick={Upload}>
            <ListItemIcon>
              <ListItemText style={{ color: 'white', marginTop:'10px' }}>
                {' '}
                <CloudUploadIcon /> upload Video
              </ListItemText>
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
      {/* Since this is inside our toolbar we can push it to the end of the toolbar */}
      <IconButton
        className={classes.iconButtonContainer}
        onClick={() => setOpenDrawer(!openDrawer)}
        disableRipple
      >
        <MenuIcon className={classes.menuIconToggle} />
      </IconButton>
    </>
  );
};

export default DrawerComponent;
