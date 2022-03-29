import React from 'react'
import { Route, Switch,BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import FreeVideo from '../pages/freeVideo'
import Login from '../pages/Login'
//import PaiedVideo from '../pages/PaiedVideo'
import UploadVideo from '../pages/UploadVideo'
import Category from '../pages/Categoriey'
import EdietModal from '../pages/EdietModal'
import AddSubCtegory from '../pages/AddSubCategory'
//import Custo from '../pages/Custo'
import CategorList from '../pages/CategoryList'
import liveMain from '../pages/LiveStream/liveMain'
import liveStrart from '../pages/LiveStream/liveStart'
import JoinEvent from '../pages/LiveStream/joinLIveEvent'
import JointEventStart from '../pages/LiveStream/joineLiveEventStart'
import TextFiled from '../pages/TestTextFiled'
import liveUser from '../pages/LiveStream/LiveUser'
import PageNotFound from '../pages/pageNotFound'
import LiveEvent from '../pages/LiveStream/LiveEvent'
const Routes = () => {

    return (
        <Switch>
            <Route path='/' exact  component={Dashboard}/>
            <Route path='/dashbord'   component={Dashboard}/>
            <Route path='/login'  component={Login}></Route>
            <Route path='/liveEvent' component={LiveEvent}/>
            <Route path='/customers' component={Customers}/>
            <Route path='/freePaied' component={FreeVideo}/>
            <Route path='/liveUser' component={liveUser}/>
            <Route path='/uploadVideo' component={UploadVideo}/>
            <Route path ='/categories' component={Category}/>
            <Route path ='/edietModal/:id' component={EdietModal}/>
            <Route path='/addSubCategory/:id' component={AddSubCtegory}/>
            <Route path ='/products' component={CategorList}/>
            <Route path ='/streamVideo' component={liveMain}/>
            <Route path ='/liveVideo/:username/:eventname/:EventType' component={liveStrart}/>
            <Route path='/joinEvent' component={JoinEvent}/>
            <Route path='/textFiled' component={TextFiled}/>
            <Route path ='/joineLiveEvent/:username/:eventname/:producer/:eventType' component={JointEventStart}/>
            <Route component={PageNotFound}/>
        </Switch>

    )
}
//userName}/${evenetName
export default Routes
