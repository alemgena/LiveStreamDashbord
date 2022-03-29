import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';

//import Table from '../components/table/Table'
import axios from 'axios'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table';
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from "../../utiles/url";
import { pink } from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { CircularProgress } from '@material-ui/core';
import Layout from '../../components/layout/Layout'
import '../record.css'
const Customers = (props) => {
   // const[status,setStatus]=useState(['Not Live'])
   const [user, setUser] = useState([]);
   const [active,setActive]=useState(true)
   const[loading,setLoading]=useState(true)
  useEffect(() => {
    if (!localStorage.getItem('Adminuser_id') || !localStorage.getItem('tokenAdmin')) {
      console.log('no token')
    props.history.push('/login');
      }
   getAllLiveUser();
    }, []);
    const getAllLiveUser=async()=>{
      axios.get(`${url}admin/getAllLiveUser`).then(responce=>{
        setUser(responce.data.data)
        setLoading(false)
      })
    }
    const updateStatus=(id)=>{
      console.log('live')
      axios.put(`${url}admin/changeStatusLiveStream/${id}`).then(responce=>{
        console.log(responce.data.data)
        getAllLiveUser()
      })
    }
    const setNonLive=(id)=>{
      console.log('non live')//changeStatusNonLive
      axios.put(`${url}admin/changeStatusNonLive/${id}`).then(responce=>{
        console.log(responce.data.data)
        getAllLiveUser()
      })
    }

    const deleteUser = (id) =>{
      console.log(id);
      axios.delete(`${url}admin/deleteLiveUser/${id}`).then((response) => {
        console.log(response);
        if (response.data.message==='delet the user scusses') {
          toast('user is delete  successfully', {
            position: 'top-right',
            autoClose: 3500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          getAllLiveUser()
        }
      });
    };
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
            <h2 className="page-header">
                live users
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table striped bordered hover responsive='lg'>
                            <thead style={{backgroundColor:"teal",color:"white"}}>
                              <tr>
                              <th> ID </th>
                                <th>Firest Name</th>
                                <th>Middle Name</th>
                                <th>Last Name</th>
                                <th>Emaile </th>
                        
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <div className='loading'>{loading && <CircularProgress />}</div>
                            {user.map((item, index) => (
          <tbody>
             <tr key={index}>
          <td>{item.userId}</td>
          <td>{item.FirstName}</td>
          <td>{item.MiddleName}</td>
          <td>{item.LastName}</td>
          <td>{item.email}</td>
        
          <td>{item.status}</td>
            <td>
              <span style={{display:"flex"}}>
                {' '}
       <IconButton    aria-label="Check" size="large" style={{transform: "rotate(35deg)"}}>
        {item.status==='Not_Live'?<DoneAllIcon onClick={(e)=>updateStatus(item.userId)} fontSize="inherit" /> : <CancelIcon onClick={(e)=>setNonLive(item.userId)} fontSize="inherit" />}
      </IconButton>
       <IconButton  onClick={(e)=>deleteUser(item.userId)} aria-label="delete" size="large">
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      
      </span>
              
              </td>
            </tr>
          </tbody>
        ))}
        {user.length<1 &&
        <div className='record'>No Record</div>
        }
                    </Table>
                        </div>
                    </div>
                </div>
                </div>
            </div>
          )}
        </div>
        </Layout>
    )
}

export default Customers
