import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import auth from './../auth/auth-helper'
import {getEvent, remove, update} from './api-events'
import {read} from './../user/api-user'
import {Redirect} from 'react-router-dom'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5),
    backgroundColor: theme.palette.primary.light,
    color: "#FFFFFF"
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: "#FFFFFF"
  },

  panel: {
    margin: `0px 0px 10px 0px`
  },

  submit: {
    marginRight: theme.spacing(2)
  }
}))

export default function Event({ match }){
  const classes = useStyles()
  const [event, setEvent] = useState([])
  const [user, setUser] = useState({})
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
      
    // Gets the event from the database
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

  // Deletes the event, ran when an admin clicks the delete button
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

  // Dynamically changes the button text depending on whether the user is attending the event or not
  var buttonText = ""
  if(event.attendees && auth.isAuthenticated()){
    if(event.attendees.includes(auth.isAuthenticated().user._id)){
      buttonText = "Cancel Attendance"
    } else {
      buttonText = "Attend"
    }
  }

  // Add or remove the user from the attending list
  function toggleAttend(){
    if(event.attendees){
      var increment = 0
      // If the user is already attending the event
      if (event.attendees.includes(auth.isAuthenticated().user._id)){
        // Remove them from the event
        event.attendees.splice(event.attendees.indexOf(auth.isAuthenticated().user._id), 1);
        increment = -1

      // If the user is not attending the event currently
      } else {
        // Add them to the attendees list
        event.attendees.push(auth.isAuthenticated().user._id)
        increment = 1
      }

      // Save the attendees list to the database
      updateAttendance(increment)
    }
  }

  // Update the event with the new attending list and attending count
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
      document.location.reload()
    })
  }
  
  // Redirect the user to the events page if this event has been deleted
  if (redirect) {
    return <Redirect to='/events/'/>
  }

  // Render the page
  return (<>
    <Paper elevation={4} className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        {event.title}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        {new Date(event.start).toDateString()}
      </Typography>
    </Paper>

    <Paper elevation={4} className={classes.root}>
      <Typography variant="body1">
        {event.description}
      </Typography>
    </Paper>
      
    {auth.isAuthenticated() &&
      <Paper elevation={4} className={classes.root}>
        <Button color="secondary" onClick={() => toggleAttend()} variant="contained" className={classes.submit}>{buttonText}</Button>
        {user.admin && <>
          <Button color="secondary" component={Link} to={"/editevent/" + event._id}>Edit</Button>
          <Button color="secondary" onClick={() => deleteEvent(event._id)} variant="contained" className={classes.submit}>Delete</Button>
        </>}
      </Paper>
    }
  </>)  
}