import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Menu from './core/Menu'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import PrivateRoute from './auth/PrivateRoute'
import Profile from './user/Profile'
import EditProfile from './user/EditProfile'
import UserAdmin from './user/UsersAdmin'

import Comments from './comments/Comments'
import Replies from './comments/Replies'
import Events from './events/Events'
import Event from './events/Event'
import MyEvents from './events/MyEvents'
import Edit from './comments/Edit'
import EventEdit from './events/EventEdit'

const MainRouter = () => {
    return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/comments" component={Comments}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>
        <Route path="/useradmin/:userId" component={UserAdmin}/>
        <Route path="/replies/:commentID" component={Replies}/>
        <Route path="/events" component={Events}/>
        <Route path="/event/:eventID" component={Event}/>
        <Route path="/myevents" component={MyEvents}/>
        <Route path="/edit/:commentID" component={Edit}/>
        <Route path="/eventEdit/:eventID" component={EventEdit}/>
      </Switch>
    </div>)
}

export default MainRouter
