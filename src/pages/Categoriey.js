import React, { Component, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import { Grid, Container, Paper, Avatar, Typography, TextField, Button, CssBaseline } from '@material-ui/core'
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
//import Table from '../components/table/Table'
import axios from 'axios'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table';
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from '../utiles/url'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import EdietModal from './EdietModal.js'
import Moment from 'react-moment';
import Layout from '../components/layout/Layout'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
const useStyles = makeStyles(theme => ({
    root: {
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	
	},
	container: {
		opacity: '0.8',
		height: '70%',
		marginTop: theme.spacing(3),
		[theme.breakpoints.down(400 + theme.spacing(2) + 2)]: {
			marginTop: 0,
			width: '100%',
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
		margin: theme.spacing(1)
	},
	button: {
		margin: theme.spacing(3, 0, 2),
    backgroundColor:'teal',
    color:'white',
	'&:hover': {
		backgroundColor: 'brown',
		color: 'white',
	},
  
	},
    butttonWith:{
        display:"flex",
        width:"100%",
	
    
    },
    fragment:{
        alignItems:'center',
        marginRight:"40px"
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
    input: {
        display: 'none'
    },
    faceImage: {
        color: theme.palette.primary.light,
      },
      customHoverFocus: {
        "&:hover, &.Mui-focusVisible, &:active": {
            backgroundColor: "teal",
          },
          "&$buttonDisabled": {
            color: "brown"
          },
        
      }
}));
const Category=(props)=>{

  const[loading,setLoading]=useState(false)
    const[CategoryName,setCategoreyName]=React.useState("")
    const[CategoryDescrieption,setCategoryeDescrieption]=React.useState("");
    const [CategorieInfo, setCategorieInfo] =React.useState([]);
    //const [subCategory,setSubCategory]=React.useState([]);
    const[parent,setParent]=React.useState([])
const deletCategory=(id)=>{
console.log(id)
axios.delete(`${url}catagorey/deletCatagoreyById/${id}`).then(
    responce=>{
        if(responce.data.data){
            console.log(responce)
            getAllDatas();
        }
    }
)
}
const AddSubCategory=(id)=>{
  props.history.push(`/addSubCategory/${id}`)
}
const EdietModalPage=(id)=>{
    console.log(id)
    props.history.push(`/edietModal/${id}`)
}
   React.useEffect(() => {
    if (!localStorage.getItem('Adminuser_id') || !localStorage.getItem('tokenAdmin')) {
      console.log('no token')
    props.history.push('/login');
      }
    getAllDatas();
    }, []);
    const getAllDatas = () => {
        axios.get(`${url}catagorey/getAllCatagory`).then((response) => {
          if (response.data.data) {
            console.log(response.data.data);
            if(response.data.data.parentId!=='null'){
            setParent(response.data.data.parent)
            }
            setCategorieInfo(response.data.data);
          } else {
            console.log('error to get categoriey');
          }
        });
      };
      console.log(parent)
    
const onSubmiet=(e)=>{
  setLoading(true)
    e.preventDefault();
    axios
    .post(`${url}catagorey/createCatagory`, {
      catagorey_name: CategoryName,
      Description: CategoryDescrieption,
    })
    .then((response) => {
      setLoading(false)
      console.log(response);
      getAllDatas();
    });
}
    const classes=useStyles()
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
  
    	<Grid container component='main' className={classes.root}>
        <CssBaseline />
        <Container component={Paper} elevation={5} maxWidth='xs' className={classes.container}>
            <div className={classes.div}>
            <Typography component='h1' variant='h5'>Add Main Category</Typography>
                <form className={classes.form}>
                
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
                        className={classes.borderTextField}
                        color='primary'
                        margin='normal'
                        variant='outlined'
                        placeholder='Descrieption'
                        name='Descrieption'
                     value={CategoryDescrieption}
                    onChange={(e) => {setCategoryeDescrieption(e.target.value);}}
      
                    />
                    		  <div className='loading'>{loading && <CircularProgress />}</div>
                    <Button
                        fullWidth
                        variant='contained'
                        style={{marginBottom:"20px"}}
                        color='teal'
                        className={classes.button}
                       onClick={(event) => onSubmiet(event)}
                    >
                        Submit
                    </Button>
                   
                </form>
               
            </div>
        </Container>
    </Grid>
    <div style={{marginTop:"20px"}}>All  Category
    <Table striped bordered hover responsive='lg'>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Descrieptiopn</th>
                              <th>Parent</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            {CategorieInfo.map((item, index) => (
          <tbody>
              <tr key={index}>
             <td>{item.catagory_Name}</td>
      <td>{item.Description}</td>
      {item.parentId!==null?(
    <td>{item.parent.catagory_Name}</td>
      ):(
        <td>{item.parentId}</td> 
      )
      }
            <td>
                {' '}
                <IconButton  onClick={(e)=>deletCategory(item.id)} aria-label="delete" size="large">
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      <IconButton onClick={(e)=>AddSubCategory(item.id)} aria-label="Add" size="large">
        <AddIcon fontSize="inherit" />
      </IconButton>
      <IconButton  onClick={(e)=>EdietModalPage(item.id)} aria-label="ediet" size="large">
        <EditIcon fontSize="inherit" />
      </IconButton>
              </td>
            </tr>
          </tbody>
        ))}
     </Table>
     </div>
     <div>
         {EdietModal}
     </div>
    </div>
    )}
    </div>
    </Layout>
);
}
export default Category
