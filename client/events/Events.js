import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import EventIcon from '@material-ui/icons/Event';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import {Link} from 'react-router-dom'
import {list} from './api-events'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import {read} from './../user/api-user'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {create} from './api-events'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  }
}))

export default function Events() {
  const classes = useStyles()
  const [events, setEvents] = useState([])
  const [user, setUser] = useState({})
  const [values, setValues] = useState({
    title: '',
    description: ''
    })

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    // Get all the events from the database
    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        // Sort dates by newest first
        setEvents(data.sort(function(a, b){
            return new Date(b.start) - new Date(a.start)
        }))
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

  // Update the variables when the user inputs new data
  const handleChange = message => event => {
    setValues({ ...values, [message]: event.target.value })
  }

  // Executed when the create event button is clicked
  const clickSubmit = () => {
    const newEvent = {
      title: values.title || undefined,
      description: values.description || undefined,
    }
    
    // Add a new event to the database
    create(newEvent, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        setValues({ ...values, error: '', open: true})
      }
      document.location.reload() //Reload the page so they can see their comment
    })  
  }

  // Render the page
  return (<>
        {user.admin && <>
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
            Admin panel
            </Typography>
            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Create a new Event
                    </Typography>
                    <TextField fullWidth id="title" variant="outlined" label="Event Title" className={classes.textField} value={values.title} onChange={handleChange('title')} margin="normal"  inputProps={{ style: { color: "black" } }} InputLabelProps={{style : {color : 'black'} }}/><br/>
                    <TextField fullWidth multiline id="description" variant="outlined" label="Event Description" className={classes.textField} value={values.description} onChange={handleChange('description')} margin="normal"  inputProps={{ style: { color: "black" } }} InputLabelProps={{style : {color : 'black'} }}/><br/>
                </CardContent>
                <CardActions>
                    <Button color="secondary" variant="contained" onClick={clickSubmit} className={classes.submit}>Post New Event</Button>
                </CardActions>
            </Card>
        </Paper>
        </>}

        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
            Events
            </Typography>
            <List>
                {events.map((item, i) => {
                    return (
                        <Link to={"/event/" + item._id} key={i}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        {auth.isAuthenticated() && <>
                                          {item.attendees.includes(auth.isAuthenticated().user._id) &&
                                            <EventAvailableIcon color="secondary"/>
                                          }
                                          {!item.attendees.includes(auth.isAuthenticated().user._id) &&
                                            <EventIcon />
                                          }
                                        </>}
                                        
                                        {!auth.isAuthenticated() &&
                                          <EventIcon />
                                        }
                                        
                                    </Avatar>
                                </ListItemAvatar>
                            <ListItemText primary={item.title} secondary={new Date(item.start).toDateString()} />
                            {user.admin && <>
                              <span style={{display:'flex', justifyContent:'flex-end'}}>
                                <ListItemText primary={"Attending: " + item.attendeesCount} secondary={"Views: " + item.views} />
                              </span>
                            </>}
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </Link>)
                })}
            </List>
        </Paper>
  </>)
}
