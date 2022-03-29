
import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Layout from '../../components/layout/Layout'
//import Table from '../components/table/Table'
import axios from 'axios'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table';
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from "../../utiles/url";
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import socketClient from 'socket.io-client';
import{ promise} from '../../utiles/SocketPromise'
import '../record.css'


const opts = {
  secure:true,
reconnect: true,
rejectUnauthorized : false
}
//let socket=socketClient(`${url}`)
let socket=socketClient('https://ethiolive.net',{ path: '/socket.io'})
socket.request = promise(socket);
const serverUrl=`${url}`
function LiveEvent(props) {
  const[event,setEvent]=useState([])
  const [active,setActive]=useState(false)
  useEffect(() => {
    if (!localStorage.getItem('Adminuser_id') || !localStorage.getItem('tokenAdmin')) {
      console.log('no token')
    props.history.push('/');
      }
      socket.on('connect', async () => {
       console.log (`connected to ${serverUrl}`)
   //  available_Devices()//

    
     });
     socket.on('disconnect', () => {
       console.log (`disconnected from ${serverUrl}`)
    //  props.history.push('/streamVideo');
     //  window.location.replace(`${hostname}/create_live_streams`);
     });
     socket.on('connect_error', (error) => {
       console.error('could not connect to %s%s (%s)', serverUrl, error.message);
       
     });
    getAllLiveEvent();
     }, []);
     const getAllLiveEvent=async()=>{
       axios.get(`${url}admin/getAllLiveEvent`).then(responce=>{
         setEvent(responce.data.data)
         console.log(responce.data.data)

       })
     }
     const updateStatus=(id)=>{
      console.log('live')
      axios.put(`${url}admin/changeLiveEventStatus/${id}`).then(responce=>{
        console.log(responce.data.data)
        getAllLiveEvent()
      })
    }
    const setNonLive=(id)=>{
      console.log('non live')//changeStatusNonLive
      axios.put(`${url}admin/changeStatusNonLiveEvent/${id}`).then(responce=>{
        console.log(responce.data.data)
        getAllLiveEvent()
      })
    }
     const deleteUser = (id) =>{
      console.log(id);
      axios.delete(`${url}admin/deleteLiveEvent/${id}`).then((response) => {
        console.log(response);
        if (response.data.data) {
          getAllLiveEvent()
          toast('user is delete  successfully', {
            position: 'top-right',
            autoClose: 3500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
    };
     //deleteLiveEvent
      async function haltuserStream(username, eventname, eventId,event_type ){
      let isProducerTransportClosed = await socket.request('haltliveStream', {username, eventname, eventId,event_type })
      console.log('isProducerTransportClosed: ', isProducerTransportClosed)
      if (isProducerTransportClosed){
        console.log('user live is stope')
      }
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
                <h2 className="page-header">
                    Live Event
                </h2>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card__body">
                                <Table striped bordered hover responsive='lg'>
                                <thead style={{backgroundColor:"teal",color:"white"}}> 
                                  <tr>
                                  <th> Descrieption</th>
             
                                    <th>Event Name</th>
                                    <th>Produced By</th>
                                    <th>Privielage Type</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                          
                        
                                {event.map((item, index) => (
              <tbody>
                 <tr key={index}>
                 <td>{item.descrieption}</td>
              <td>{item.eventName}</td>
              <td>{item.producer}</td>
              <td>{item.Privielage}</td>
              <td>{item.status}</td>
                <td>
                <IconButton  aria-label="Check" size="large" style={{transform: "rotate(35deg)"}}>
        {item.status==='Not_Live' ?<DoneAllIcon onClick={(e)=>updateStatus(item.Id)} fontSize="inherit" /> : <CancelIcon onClick={(e)=>setNonLive(item.Id)} fontSize="inherit" />}
      </IconButton>
                   
             <IconButton  onClick={(e)=>deleteUser(item.Id)} aria-label="delete" size="large">
            <DeleteIcon fontSize="inherit" />
          </IconButton>
          {item.status==='Live' &&
          <IconButton  onClick={(e)=>haltuserStream(item.producer,item.eventName,item.eventId ,item.Privielage)} aria-label="delete" size="large">
        <StopScreenShareIcon fontSize="inherit" />
      </IconButton>
      }
                  </td>
                </tr>
              </tbody>
                                ))}
                                {event.length<1 &&
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

export default LiveEvent
