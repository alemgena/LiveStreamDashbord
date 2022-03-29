import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@material-ui/core/Button';
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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'
import Layout from '../../components/layout/Layout'
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
  React.useEffect(() => {
    if (!localStorage.getItem('Adminuser_id') || !localStorage.getItem('tokenAdmin')) {
      console.log('no token')
    props.history.push('/login');
      }
      else{
        setUserName(user.username)
      }
    },[])
  const user=JSON.parse(localStorage.getItem('AdminloginInfo'))
 console.log(user);
  const [open, setOpen] = React.useState(true)
  const [userName,setUserName]=React.useState('')
  const [evenetName,setEvenetName]=React.useState('')
  //const handleClose = () => setOpen(false);
  const[CategoryName,setCategoreyName]=React.useState("")
    const[CategoryDescrieption,setCategoryeDescrieption]=React.useState("");
    const[eventType,setEvenetType]=React.useState('Public')
  const id = props.match.params.id
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
  const event=evenetName.replace(/ /g,"_");
      props.history.push(`/admin/liveVideo/${userName}/${event}/${eventType}`)
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
                    
                        onChange={(e) => {setUserName(e.target.value)}}
                    
                    />
                     <TextField
                        fullWidth
                        autoFocus
                       // color='primary'
                        className={classes.borderTextField}
                        margin='normal'
                        variant='outlined'
                        placeholder='Evenet Name'
                        name='Name'   
                       value={evenetName}
                       onChange={(e) => {setEvenetName(e.target.value)}}
                    />
                    <div style={{marginTop:"20px", 
                        }}> 

                        <FormControl component="fieldset">
                        <FormLabel component="legend">Evenet Type</FormLabel>
                        <RadioGroup row aria-label="gender" name="row-radio-buttons-group"
                            // eslint-disable-next-line react/jsx-no-duplicate-props
                            aria-label="gender"
                            value={eventType}
                        onChange={(e) => {
                        setEvenetType(e.target.value);
                        }}
                        >
                  
                          <FormControlLabel value="Public" control={<Radio />} label="Public" />
                          <FormControlLabel value="Private" control={<Radio />} label="Priviet" />
                        </RadioGroup>
                      </FormControl>
                      <div>
              <Button onClick={handleChange}  className={classes.button} endIcon={<LiveTvIcon/>}>
        Start live
     </Button>
      <Button onClick={handleClosedModal}  className={classes.button} endIcon={<CancelIcon />}>
        cancel
      </Button>
      </div>
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