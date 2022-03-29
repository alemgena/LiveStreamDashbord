import React, { useState } from 'react'
import { Grid, Container, Paper, Avatar, Typography, TextField, Button, CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook';
import { useDispatch, useSelector } from 'react-redux';
//import { recoverPasswordSlice } from '../../slices/recover_password';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { loginSlice } from '../slices/login';
import axios from 'axios';
import { url } from '../utiles/url';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import shortid from'shortid';
import {IconButton} from '@material-ui/core'
 import { Close } from '@material-ui/icons';
 import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
const useStyles = makeStyles(theme => ({
	root: {
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		height: '700px'
	},
	container: {
		opacity: '0.8',
		height: '90%',
		marginTop: theme.spacing(3),
		[theme.breakpoints.down(400 + theme.spacing(2) + 2)]: {
			marginTop: 0,
			width: '90%',
			height: '100%'
		}
	},
	div: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
        marginBottom:"40px"
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	button: {
		margin: theme.spacing(3, 0, 2),
    backgroundColor:'teal',
    color:'white',
	'&:hover': {
		backgroundColor: 'teal',
		color: 'white',
	},
  
	},
    butttonWith:{
        display:"flex",
        width:"100%",
	
    
    },
	hover:{
		'&:hover': {
			backgroundColor: 'brown',
			color: 'white',
		},
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

const Login = (props) => {
	const[openAlert,setOpenAlert]=useState(false)
	const[loading,setLoading]=React.useState('')
const[AdminRole,setAdminRole]=useState('')
const[emaileInput,setEmailInput]=useState('')
	const[emaielAdmin,setEmaileAdmin]=useState('')
	const[password,setPassword]=useState('')
	const[passwordError,setPasswordErr]=useState('')
	const[emaileError,setEmaileError]=useState('')
   // const recoverPasswowrdActions = recoverPasswordSlice.actions;
	
	const validate = (e) => {
		e.preventDefault();
		// Resetting input errors to default
	
		let isValid = true;
		if (password.length < 6) {
		
		  isValid = false;
		}
	
		if (isValid) {
		 requestLogin();
		}
	  };
	  const onSubmit=()=>{

	  }
	  const requestLogin = () => {
		axios
		  .post(`${url}login/`, {
			user_identifier:emaielAdmin,
			password: password,
		  })
		  .then(
			(response) => {
				console.log(response.data)
				setAdminRole(response.data.role);
				
			  if (response.data.emailFailure) {
				setEmaileError('Email address does not exist!');
			  } else if (response.data.passwordFailure) {
		         setPasswordErr('Incorrect password!');
			  }
			  else if(response.data.role!=='admin'){
				  setEmaileError('your role is not admin')
			  }
			   else if (response.data.emailOrUserNameFailure) {
				setEmaileError('user name or email is not correct');
			  }
			  else if (response.data.role==='admin') {
				  console.log(response.data)
				console.log(response.data.token)	
				localStorage.setItem('tokenAdmin', response.data.token);
				localStorage.setItem('Adminuser_id', response.data.id);
				localStorage.setItem('AdminloginInfo', JSON.stringify(response.data));
					props.history.push(`/dashbord`);
			   }
			  
			},
			(error) => {
			  console.log(error);
			
			}
		  );
	  };
	  const [open, setOpen] = React.useState(false);

	  const handleClickOpen = () => {
		setOpen(true);
	  };
	const newPassword=shortid.generate()
	  const handleClose = () => {
		setOpen(false);
	  };
	  const classes = useStyles()
	  const showRecoverPassword=()=>{
setOpen(true)
	  }
	  const config = {
		headers: {
		  'Content-Type': 'application/json',
		  mode: 'cors',
		},
	  };
	  const[sentEmaile,setSentEmail]=useState(false)
	  const[sentEmaileError,setSentEmailError]=useState(false)
	 const sendEmaile=()=>{
		 axios.post(`${url}admin/adminPasswordSend`,{
			 emaile:emaileInput,
			 password:newPassword
		 },config).then(response=>{
			 console.log(response)
			 if(response.data.message==='send password is success'){
              setOpenAlert(true)
			  setOpen(false);
			 }
			 else{
setSentEmailError(true)
setOpen(true);
			 }
		 })
	 }
	return (
		<Grid container component='main' className={classes.root}>
			<CssBaseline />
			<Container component={Paper} elevation={5} maxWidth='xs' className={classes.container}>
				<div className={classes.div}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>Sign In</Typography>
					<Collapse in={openAlert}>
					<Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
             >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
   The New Password Is Send In Your Email
        </Alert>
      </Collapse>
					<form className={classes.form}>
				
							
						<TextField
							fullWidth
						//	autoFocus
							//color='primary'
							className={classes.borderTextField}
							margin='normal'
							variant='outlined'
							placeholder='Email of UserName'
							name='nickname'
							value={emaielAdmin}
							onChange={(e) => {
							setEmaileAdmin(e.target.value)
							  }}
						
						/>
					
						    <div className='form-error'>{emaileError}</div>
						<TextField
							fullWidth
							type='password'
							className={classes.borderTextField}
							color='primary'
							margin='normal'
							placeholder='Password'
							variant='outlined'
							name='password'
							value={password}
							onChange={(e) => {
							setPassword(e.target.value);
							}}
          
						/>
							
						  <div className='form-error'>{passwordError}</div>
						<Button
							fullWidth
							variant='contained'
                            style={{marginBottom:"20px"}}
							color='teal'
							className={classes.button}
							onClick={(event) => validate(event)}
						>
							Sign In
						</Button>
                       
					</form>
<div style={{marginRight:"19px", marginTop:"15px"}} className='login-bottom-item'>
          <div className='text'>Lost password?
          <button style={{marginLeft:"10px"}} className='link'  onClick={showRecoverPassword}>
            Recover password</button>
          </div>
          </div>
				</div>
			</Container>

			<Dialog
			PaperProps={{
				sx: {
				  width: "36%",
				  maxHeight: 300
				}
			  }}
        open={open}
     
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >      <Box position="absolute" top={0} right={0}>
	  <IconButton onClick={handleClose}>
	  <Close />
	</IconButton>
  </Box> 
        <DialogContent style={{marginTop:"10px"}}>
		<DialogContentText>
		<TextField
							fullWidth
						//	autoFocus
							//color='primary'
							className={classes.borderTextField}
							margin='normal'
							variant='outlined'
							placeholder='Email'
						
							value={emaileInput}
							onChange={(e) => {
							setEmailInput(e.target.value)
							  }}
						
						/>
						{sentEmaileError &&
						<div style={{color:"red"}}>Inccorect Emaile</div>
}
					  </DialogContentText>
        </DialogContent>
  
          <Button className={classes.button}   onClick={() => {

   sendEmaile();
}}>Send</Button>
       
 
      </Dialog>
		</Grid>
	)
}

export default Login
