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
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from '../utiles/url'
import { makeStyles } from '@material-ui/core/styles'
import { toast } from 'react-toastify'
import Layout from '../components/layout/Layout'
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
  const [open, setOpen] = React.useState(true);
  //const handleClose = () => setOpen(false);
  const[CategoryName,setCategoreyName]=React.useState("")
    const[CategoryDescrieption,setCategoryeDescrieption]=React.useState("");
  const id = props.match.params.id
  const handleClosedModal=()=>{
     setOpen(false);
props.history.push('/admin/categories')
  }
  const classes=useStyles();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      mode: 'cors',
    },
  };
  const handleChange=(e)=>{
    e.preventDefault();
    axios.post(`${url}catagorey/createCatagory`,{
      CategoryID:id,
      catagorey_name: CategoryName,
      Description: CategoryDescrieption,
    },config)
    .then((response) => {
        if(response.data.data==='scusses'){
      console.log(response);
      props.history.push('/categories')
        }
    });

}

  return (
    <Layout>
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
                        color='primary'
                        className={classes.borderTextField}
                        margin='normal'
                        variant='outlined'
                        placeholder='Name'
                        name='Name'
                        
value={CategoryName}
                        onChange={(e) => {setCategoreyName(e.target.value)}}
                    
                    />
                     <TextField
                        fullWidth
                        autoFocus
                        color='primary'
                        className={classes.borderTextField}
                        margin='normal'
                        variant='outlined'
                        placeholder='Descrieption'
                        name='Name'   
                       value={CategoryDescrieption}
                       onChange={(e) => {setCategoryeDescrieption(e.target.value)}}
                    />
                    <div style={{marginTop:"20px",
                        }}> 
              <Button onClick={handleChange} style={{marginLeft:"80px"}} variant="contained" endIcon={<SaveIcon />}>
        Save
     </Button>
      <Button onClick={handleClosedModal} style={{marginLeft:"80px"}} variant="contained" endIcon={<CancelIcon />}>
        cancel
      </Button>
      </div>
      
          </Box>
        </Fade>
      </Modal>
    </div>
    </Layout>
  );
}