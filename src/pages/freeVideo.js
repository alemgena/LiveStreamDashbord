import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
//import Table from '../components/table/Table'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Layout from '../components/layout/Layout'
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from '../utiles/url'

const useStyles = makeStyles({
  topScrollPaper: {
    alignItems: 'flex-start',
  },
  topPaperScrollBody: {
    verticalAlign: 'top',
  },
})
const FreeVideo = (props) => {
  
    const [video, setVideo] = useState([]);
    useEffect(() => {
      if (!localStorage.getItem('Adminuser_id') || !localStorage.getItem('tokenAdmin')) {
        console.log('no token')
      props.history.push('/login');
        }
   getAllVideo();
      
    }, []);
    const classes = useStyles()
    const [user,setUser]=useState([])
    const getAllVideo=async()=>{
        axios.get(`${url}video/getAllVideo`).then((response) => {
            if (response) {
              console.log(response.data.video);
              setVideo(response.data.video);
              setUser(response.data.video[0].usersInfos[0])
            } else {
              console.log('field  to get the video data');
            }
          });
    }
   const[isDeleted,setIsDeleted]=useState(false)
   console.log(user)
    const deletVideo = (id) => {
      console.log(id);
      axios.delete(`${url}video/deletVideo/${id}`).then((response) => {
        console.log(response);
        if (response.data.message==='delet the video scusses') {
          setOpen(true)
          toast('video is delete  successfully', {
            position: 'top-right',
            autoClose: 3500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          getAllVideo()
        }
      });
    };
    const [open, setOpen] = React.useState(false);
  
    const handleClose = () => {
      setOpen(false);
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
                All Free Video
            </h2>
       
            <Dialog
             classes={{
              scrollPaper: classes.topScrollPaper,
              paperScrollBody: classes.topPaperScrollBody,
            }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          delet video is successfully
          </DialogContentText>
        </DialogContent>
      </Dialog>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table striped bordered hover responsive='lg'>
                            <thead style={{backgroundColor:"teal",color:"white"}}> 
                              <tr>
                                <th>filePath</th>
                           
                                <th>title </th>
                                <th>Descriepiton</th>
                                <th>uploadedBy</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                        
                    
                            {video.map((item, index) => (
          <tbody>
             <tr key={index}>
      <td>{item.filePath}</td>
      <td>{item.video_title.Title}</td>
      <td>{item.video_title.Descrieption}</td>
     <td>{user.FirstName}</td>
            <td>
                {' '}
                <button
                     onClick={(e)=>deletVideo(item.video_id)}
                  type='button'
                  className='btn btn-danger'
                >
           <DeleteIcon/>
                </button>
              </td>
            </tr>
          </tbody>
        ))}
        

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

export default FreeVideo
