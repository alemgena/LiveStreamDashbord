import React, {useEffect,useState} from 'react'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { url } from '../utiles/url'
import Chart from 'react-apexcharts'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'

import StatusCard from '../components/status-card/StatusCard'

import Table from '../components/table/Table'
import Layout from '../components/layout/Layout'
import Badge from '../components/badge/Badge'

//import statusCards from '../assets/JsonData/status-card-data.json'



const Dashboard = (props) => {
    const [user, setUser] = useState([]);
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        if (!localStorage.getItem('Adminuser_id') || !localStorage.getItem('tokenAdmin')) {
            console.log('no token')
          props.history.push('/login');
            }
      axios.get(`${url}admin/getAllUser`).then((response) => {
        if (response) {
          //console.log(response.data.users);
          // console.log(response.data.success.thumbnialFilePath);
  
          setUser(response.data.users);
        } else {
          console.log('field  to get the video data');
        }
        
      });

  getAllVideo();
  getAllCatagory();
    }, []);
    const[categorei,setCategorieInfo]=React.useState([])
    const getAllCatagory = () => {
        axios.get(`${url}catagorey/getAllCatagory`).then((response) => {
          if (response.data.data) {
            console.log(response.data.data);
            setCategorieInfo(response.data.data);
          } else {
            console.log('error to get categoriey');
          }
        });
      };
    const getAllVideo=async()=>{
       
        await axios.get(`${url}video/getAllVideo/`).then((response) => {
            if (response) {
              console.log(response.data.video);
              // console.log(response.data.success.thumbnialFilePath);
              setVideos(response.data.video);
            } else {
              console.log('field to get the video data');
            }
          });
        
    }
    console.log(videos.length);
    const statusCards=[
        {
          "icon": "bx bx-video",
          "title": "Total  Video"
        },
    ]
    const statusCardsTwo=[
        {
            "icon": "bx bx-user-pin",
            "title": "Total User"
        },
    ] 
    const statusCardsThree=[
        {
            "icon": "bx bx-list-ol",
            "title": "Total Categorei"
        },
    ]

    const themeReducer = useSelector(state => state.ThemeReducer.mode)

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
            <h2 className="page-header">Dashboard</h2>
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        {
                            statusCards.map((item, index) => (
                                <div className="col-6" key={index}>
                                    <StatusCard
                                        icon={item.icon}
                                        count={videos.length}
                                        title={item.title}
                                    />
                                </div>
                            ))
                        }
                          {
                            statusCardsTwo.map((item, index) => (
                                <div className="col-6" key={index}>
                                    <StatusCard
                                        icon={item.icon}
                                        count={user.length}
                                        title={item.title}
                                    />
                                </div>
                            ))
                        }
                            {
                        statusCardsThree.map((item, index) => (
                                <div className="col-6" key={index}>
                                    <StatusCard
                                        icon={item.icon}
                                        count={categorei.length}
                                        title={item.title}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
         
            </div>
         
        </div>
          )}
        </div>
        </Layout>
    )
}

export default Dashboard
