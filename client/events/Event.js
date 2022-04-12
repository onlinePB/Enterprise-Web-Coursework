import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowForward from '@material-ui/icons/ArrowForward'
import Person from '@material-ui/icons/Person'
import {Link} from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import auth from './../auth/auth-helper'
import TextField from '@material-ui/core/TextField'
import CardHeader from '@material-ui/core/CardHeader';
import {getEvent, remove, update} from './api-events'
import {read} from './../user/api-user'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5),
    backgroundColor: theme.palette.primary.light
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
}))

export default function Event({ match }){
    const classes = useStyles()
    const [event, setEvent] = useState([])
    const [user, setUser] = useState({})
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {

      const abortController = new AbortController()
      const signal = abortController.signal

        getEvent(match.params.eventID).then((data) => {
          if (data && data.error) {
            console.log(data.error)
          } else {
            setEvent(data)
          }
        })
        
        // Check to see if the user is an admin
        if (auth.isAuthenticated() != false){
          read({
            userId: auth.isAuthenticated().user._id
          }, {t: auth.isAuthenticated().token}, signal).then((data) => {
            if (data && data.error) {
              console.log("error")
            } else {
              setUser(data)
            }
          })
        } else {
          setUser({"admin":false})
        }

        return function cleanup(){
          abortController.abort()
        }

        
    }, [])

  function deleteEvent(eventID){
      remove(eventID, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id).then((data) =>{
          if (data.error) {
              console.log(data.error)
          } else {
            setRedirect(true)
            document.location.reload()
          }
      })
  }

  function toggleAttend(){
    if(event.attendees){
      var increment = 0
      if (event.attendees.includes(auth.isAuthenticated().user._id)){
        event.attendees.splice(event.attendees.indexOf(auth.isAuthenticated().user._id), 1);
        increment = -1
      } else {
        event.attendees.push(auth.isAuthenticated().user._id)
        increment = 1
      }
      updateAttendance(increment)
    }
  }

  function updateAttendance(increment) {
    const eventUpdate = {
      title: event.title,
      description: event.description,
      attendees: event.attendees,
      attendeesCount: event.attendeesCount + increment
    }
    update(event._id, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id, eventUpdate).then((data) => {
      if (data && data.error) {
        //setValues({...values, error: data.error})
      } else {
        //setValues({...values, userId: data._id, redirectToProfile: true})
      }
    })
  }
  
  
  if (redirect) {
    return <Redirect to='/events/'/>
  }
    return (<>
      <Paper elevation={4}>
        <Typography variant="h6" className={classes.commentTitle}>
            {event.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {new Date(event.start).toDateString()}
        </Typography>
      </Paper>
      <Paper elevation={4}>
        <Typography variant="body1">
          {event.description}
        </Typography>
      </Paper>
      
      {auth.isAuthenticated() &&
      <Card>
        <Button color="secondary" onClick={() => toggleAttend()} variant="contained" className={classes.submit}>Attend</Button>
        {user.admin && <>
          <Button color="secondary" onClick={() => deleteEvent(event._id)} variant="contained" className={classes.submit}>Delete</Button>
        </>}
      </Card>
      }
    </>)
    
}