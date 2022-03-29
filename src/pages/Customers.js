import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
//import Table from '../components/table/Table'
import axios from 'axios'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table';
import LogoutIcon from '@mui/icons-material/Logout';
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from '../utiles/url'
import Layout from '../components/layout/Layout'
import { CircularProgress } from '@material-ui/core';
import './record.css'
const Customers = (props) => {
  const[loadining,setLoading]=useState(true)
  const[record,setRocord]=useState(false)
  const [user, setUser] =React.useState([]);
    const[countVideo,setVideoCount]=useState("");
    useEffect(() => {
      if (!localStorage.getItem('Adminuser_id') || !localStorage.getItem('tokenAdmin')) {
        console.log('no token')
      props.history.push('/login');
        }
   getAllUser();
    }, []);
    const getAllUser=async()=>{
      axios.get(`${url}admin/getAllUser`).then(responce=>{
        setVideoCount(responce.data.users.count)
        setUser(responce.data.users)
        setLoading(false)
        if(responce.data.users.length<1){
          setRocord(true)
          setLoading(false)
        }
      })
    }
    console.log(user)
    const deleteUser = (id) => {
      console.log(id);
      axios.delete(`${url}admin/${id}`).then((response) => {
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
          getAllUser()
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
                customers
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
                                <th>Phone NUmber</th>
                  
                               
                                <th>Action</th>
                              </tr>
                            </thead>
                            <div className='loading'>{loadining && <CircularProgress />}</div>
                            {user.map((item, index) => (
          <tbody>
             <tr key={index}>
          <td>{item.userId}</td>
          <td>{item.FirstName}</td>
          <td>{item.MiddleName}</td>
          <td>{item.LastName}</td>
          <td>{item.usersAddress.email}</td>
          <td>{item.usersAddress.phone}</td>
 
        
            <td>
                {' '}
                <button
                     onClick={(e)=>deleteUser(item.userId)}
                  type='button'
                  className='btn btn-danger'
                >
           <DeleteIcon/>
                </button>
              </td>
            </tr>
          </tbody>
        ))}
         {record &&
        <div className='record'>no record</div>
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
