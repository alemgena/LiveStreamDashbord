import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import { TextField } from '@material-ui/core'
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios'
import LiveTvIcon from '@mui/icons-material/LiveTv';
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from '../../utiles/url'
import { makeStyles } from '@material-ui/core/styles'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';
import MenuItem from '@mui/material/MenuItem';
import { Device } from 'mediasoup-client';
import socketClient from 'socket.io-client';
import{ promise} from '../../utiles/SocketPromise'
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Layout from '../../components/layout/Layout'
const opts = {
    secure:true,
  reconnect: true,
  rejectUnauthorized : false
  }
const socket = socketClient(`${url}`,opts)
const serverUrl=`${url}`

//list options

socket.request = promise(socket);
const style = {
  position: 'absolute',
  top: '50%',
  left: '60%',
  transform: 'translate(-50%, -50%)',
  width:" 700px",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    marginLeft: '30px',
    color:"white",
    backgroundColor:"teal",
    "&:hover":{
        backgroundColor:"teal",
    }
  },
borderTextField: {                           // - The TextField-root
 
  // (Note: space or no space after & matters. See SASS "parent selector".)
  '& .MuiOutlinedInput-root': {  // - The Input-root, inside the TextField-root
      '& fieldset': {            // - The <fieldset> inside the Input-root
          borderColor: 'teal', 
  border: 'solid 3px ',   // - Set the Input border
      },
      '&:hover fieldset': {
          borderColor: 'teal',
  border: 'solid 3px ', // - Set the Input border when parent has :hover
      },
      '&.Mui-focused fieldset': { // - Set the Input border when parent is focused 
          borderColor: 'teal',
  border: 'solid 3px ',
      },
  },
},
}))
export default function TransitionsModal(props) {

  //  const[username,setUserName]=useState("")
  const privateId= window.location.search.slice(1)
  console.log(privateId)
    const[eventList,setEventLiset]=React.useState([])
    React.useEffect(()=>{
      if (!localStorage.getItem('Adminuser_id') || !localStorage.getItem('tokenAdmin')) {
        console.log('no token')
      props.history.push('/login');
        }
        else{
      getAllLiveEvent()
      setUserName(user.username)
        }
    },[])
    const getAllLiveEvent=async()=>{
      if (privateId === "id"){
        console.log("event is public")
       axios.get(`${url}admin/getAllLiveEventForUser`).then(responce=>{
        setEventLiset(responce.data.data)
         console.log(responce.data.data)
       })
      }
      else{
        axios.get(`${url}admin/getAllPrivietLiveEvent`).then(responce=>{
          setEventLiset(responce.data.data)
          console.log(responce.data.data)
        
        })
      }
     }
    const user=JSON.parse(localStorage.getItem('AdminloginInfo'))
  const [open, setOpen] = React.useState(true)
  const [userName,setUserName]=React.useState('')
  const [evenetName,setEvenetName]=React.useState('')
  //const handleClose = () => setOpen(false);

  const handleClosedModal=()=>{
     setOpen(false);
props.history.push('/dashbord')
  }
  const classes=useStyles();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      mode: 'cors',
    },
  };
  
  const handleChange=(e)=>{
    const eventInfo=eventList.find(event=>event.Id===evenetName)
    console.log(eventInfo)
    let producer =eventInfo.producer
    let eventType=eventInfo.Privielage

    const eventName=eventInfo.eventName
    props.history.push(`/joineLiveEvent/${userName}/${eventName}/${producer}/${eventType}`);

     
}
  return (
    <Layout>
    <div>
      {!localStorage.getItem('Adminuser_id') || !localStorage.getItem('tokenAdmin')
        ?(
          toast.info('Log to  creat livestream! ', {
            position: 'top-left',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })):(
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
     //   onClose={handleClosedModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
                 <TextField
                        fullWidth
                        autoFocus
                        value={userName}
                        color='primary'
                        className={classes.borderTextField}
                        margin='normal'
                        variant='outlined'
                        placeholder='User Name'
                        name='Name'
                        id="outlined-basic" 
                        onChange={(e) => {setUserName(e.target.value)}}
                    />
                    <lable>Select Event</lable>
                    <FormControl fullWidth style={{marginTop:"20px"}}>
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
         value={evenetName}
       
          onChange={(e) => {
            setEvenetName(e.target.value)
              }}
        > 
        {eventList.map((iteam,index)=>(
      
      <MenuItem value={iteam.Id}>{iteam.eventName}</MenuItem>
          )) }

        </Select>
      </FormControl>
                    <div style={{marginTop:"20px",
                        }}> 
              <Button onClick={handleChange}  className={classes.button} style={{marginLeft:"80px"}}  endIcon={<LiveTvIcon/>}>
        Start live
     </Button>
      <Button onClick={handleClosedModal}  className={classes.button}style={{marginLeft:"80px"}}  endIcon={<CancelIcon />}>
        cancel
      </Button>
      </div>
      
          </Box>
        </Fade>
      </Modal>
    </div>
)}
    </div>
    </Layout>
  );
}