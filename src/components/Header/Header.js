/* eslint-disable no-mixed-operators */
import React from 'react'
import logo from '../../assets/images/logo.png'
import MenuIcon from '@material-ui/icons/Menu';
import { MenuItem } from '@mui/material';
import './header.css'
import LogoutIcon from '@mui/icons-material/Logout';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import { useHistory } from 'react-router';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import Tooltip from '@material-ui/core/Tooltip';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Logo from './RCNDC.png'
const useStyles = makeStyles((theme) => ({
customTooltip: {
  // I used the rgba color for the standard "secondary" color
  backgroundColor: 'rgba(220, 0, 78, 0.8)',
},

customNeweTooltip: {
  // I used the rgba color for the standard "secondary" color
  backgroundColor: '#ff6a6a',
},
//
customArrow: {
  color: '#f1f1f1',
},
grow: {
  flexGrow: 1,
},
}))
function Header() {
    const[anchorEl2,setAnchorEl2]=React.useState(null)
  const handleClickLive = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleCreatLive= () => {

    history.push('/streamVideo')
  } ;//creatLiveEvent
  const handleJoinEvent= () => {
    setAnchorEl2(null);
    history.push({
    pathname: '/joinEvent',
    search: '?id'
    })
  }
  const handleCloseLive = () => {
    setAnchorEl2(null);
  
  };
  const classes = useStyles();
  const[isLogin,setIsLogin]=React.useState(false)
  React.useEffect(() => {
    if (localStorage.getItem('Adminuser_id') || localStorage.getItem('tokenAdmin')) {
      setIsLogin(true)
      
        }
      },[])
    const history = useHistory();
 const logout=()=>{


localStorage.removeItem('Adminuser_id')
localStorage.removeItem('tokenAdmin')
history.push('/login')
 }
    return (
        <div className='header'>
            <div className='heder-left'>

            <MenuItem/>
            <img src={Logo} className='header_logo' alt="company logo" />
            </div>
         
            <div >
            <Tooltip
              title='Creat LiveStream'
 
              classes={{
                tooltip: classes.customTooltip,
                arrow: classes.customArrow,
              }}
              aria-label='add'
              arrow>
            <IconButton style={{color:"white", backgroundColor: 'transparent' }} >
            <LiveTvIcon  onClick={handleCreatLive} className='header_icon'/>
            </IconButton>
            </Tooltip>
            <Tooltip
              title='Join LiveStream'
 
              classes={{
                tooltip: classes.customTooltip,
                arrow: classes.customArrow,
              }}
              aria-label='add'
              arrow>
            <IconButton style={{color:"white" ,backgroundColor: 'transparent' }} >
            <MeetingRoomIcon onClick={handleJoinEvent}  className='header_icon'/>
            </IconButton>
            </Tooltip>
   <Tooltip
              title='Logout'
 
              classes={{
                tooltip: classes.customTooltip,
                arrow: classes.customArrow,
              }}
              aria-label='add'
              arrow>
                <IconButton style={{ color:"white",backgroundColor: 'transparent' }} >
                <LogoutIcon  onClick={() => {
                    history.push('/');
                    logout()
                  }} className='header_icon'/>
                </IconButton>
                  </Tooltip>

            </div>
        </div>
    )
}

export default Header
/*
   <div className='header_input'>
   <input className='inputType' type= 'text'/>
   <SearchIcon className='header_inputIcon'/>
   </div>
   */