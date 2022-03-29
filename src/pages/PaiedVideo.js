import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
//import Table from '../components/table/Table'
import axios from 'axios'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table';
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from '../utiles/url'
const FreeVideo = () => {
    const [video, setVideo] = useState([]);
    useEffect(() => {
    }, []);
    return (
        <div>
            <h2 className="page-header">
                All Paied Video
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table striped bordered hover responsive='lg'>
                            <thead>
                              <tr>
                                <th>filePath</th>
                                <th>title </th>
                                <th>Descriepiton</th>
                                <th>Price</th>
                                <th>uploadedBy</th>
                                <th>Action</th>
                              </tr>
                            </thead>
           
                    </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FreeVideo
