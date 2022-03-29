import React, {useEffect} from 'react'

import './layout.css'
import DrawerComponent from './Draweyer'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import Routes from '../Routes'
import {
    useMediaQuery,  useTheme,
  } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import Header from '../Header/Header'
import ThemeAction from '../../redux/actions/ThemeAction'

const Layout = ({children}) => {

    const themeReducer = useSelector(state => state.ThemeReducer)

    const dispatch = useDispatch()

    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')

        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

        dispatch(ThemeAction.setMode(themeClass))

        dispatch(ThemeAction.setColor(colorClass))
    }, [dispatch])
    const theme = useTheme(); 
    const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
    return (
      <div>
           <Header/>
            <Route render={(props) => (
                
                <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                      
          <div>
       
          <div>
          <Sidebar {...props}/>
          </div>
                    <div className="layout__content">
                        <div className="layout__content-main">
                  {children}
                        </div>
                    </div>
          </div>
                  
            )
                </div>
            )}/>
   </div>
    )
}

export default Layout
