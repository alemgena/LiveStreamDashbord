import React from 'react'

import './topnav.css'
import LiveTvIcon from '@material-ui/icons/LiveTv';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router';
import { makeStyles} from "@material-ui/core";

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


import Dropdown from '../dropdown/Dropdown'

import ThemeMenu from '../thememenu/ThemeMenu'

import notifications from '../../assets/JsonData/notification.json'

import user_image from '../../assets/images/tuat.png'

import user_menu from '../../assets/JsonData/user_menus.json'
const useStyles = makeStyles(theme => ({
    icon: {
      "& :visited": { color: "red" },
      "& :hover": { color: "red" },
      "& :active": { color: "red" }
    }
  }));
const Topnav = () => {
  const[anchorEl2,setAnchorEl2]=React.useState(null)
  const handleClickLive = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleCreatLive= () => {
    setAnchorEl2(null);
    history.push('/streamVideo')
  } ;//creatLiveEvent
  const handleJoinEvent= () => {
    setAnchorEl2(null);
    history.push('/joinEvent')
  }
  const handleCloseLive = () => {
    setAnchorEl2(null);
  
  };
    const classes = useStyles();
    const history = useHistory();
    const menuId = 'primary-search-account-menu';
    return (
        <div className='topnav'>
            <div className="topnav__search">
                <input type="text" placeholder='Search here...' />
                <i className='bx bx-search'></i>
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    {/* dropdown here */}
                    <IconButton
                edge='end'
                aria-label='account of current user'
                aria-controls={menuId}
                aria-haspopup='true'
                onClick={handleClickLive}
                color='inherit'
              >
                <LiveTvIcon />
              </IconButton>
        
              <Menu
              id="simple-menu"
              anchorEl={anchorEl2}
              keepMounted
              open={Boolean(anchorEl2)}
              onClose={handleCloseLive}
            >
          
              <MenuItem className={classes.MenuItem} onClick={handleCreatLive}>Create Live</MenuItem>
              <MenuItem className={classes.MenuItem}  onClick={handleJoinEvent}>Join Live</MenuItem>
            </Menu>
       
                    <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              className={classes.icon}
              onClick={() => {
                history.push('/login')
              }}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
                </div>
            
                <div className="topnav__right-item">
                    <ThemeMenu/>
                </div>
            </div>
        </div>
    )
}

export default Topnav
