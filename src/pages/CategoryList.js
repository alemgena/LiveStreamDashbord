import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import axios from 'axios'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from '../utiles/url'
export default function CategorieList() {
  const [sub, setSub] = React.useState([]);
  const [CategorieInfo, setCategorieInfo] =React.useState([]);
  React.useEffect(() => {
    getAllDatas();
    }, []);
  const getAllDatas = () => {
    axios.get(`${url}catagorey/getAllCatagory`).then((response) => {
      if (response.data.data) {
        console.log(response.data);
        setCategorieInfo(response.data.data);
      } else {
        console.log('error to get categoriey');
      }
    });
  };
  const getSubCategory=(id)=> {
    console.log(id)
    axios.get(`${url}catagorey/getAllSubCatagory/${id}`).then((response) => {
      if (response.data.data) {
        console.log(response.data);
        setSub(response.data.data);
      } else {
        console.log('error to get categoriey');
      }
    });

  }

  return (
    <List 
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
    All Category
        </ListSubheader>
      }
    >
        <div style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
        <div>
        {CategorieInfo.map((item,index)=>(

      <ListItemButton onClick={(e)=>
            {
              getSubCategory(item.id)
            }}>
        <ListItemText primary={item.catagory_Name} />
        <ArrowRightIcon />
      </ListItemButton>
        ))}
        </div>
        {sub.length ?(
 <div >
 {sub.map((item,index)=>(

<ListItemButton >
    
 <ListItemText primary={item.catagory_Name} />

</ListItemButton>
 ))}
 </div> ):(
            <div> <ListItemText primary='No Sub Category'/></div>
        )}
        </div>
      
    </List>
  );
}