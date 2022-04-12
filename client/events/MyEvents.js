import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import {Link} from 'react-router-dom'
import {list} from './api-events'
import auth from './../auth/auth-helper'

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

export default function MyEvents() {
  const classes = useStyles()
  const [events, setEvents] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        // Sort dates by newest first
        setEvents(data.sort(function(a, b){
            return new Date(b.start) - new Date(a.start)
        }))
      }
    })}, [])

    return (<>
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
            Your Events
            </Typography>
            <List>
                {events.map((item, i) => {
                    if(item.attendees.includes(auth.isAuthenticated().user._id)){
                        return (
                            <Link to={"/event/" + item._id} key={i}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <EventAvailableIcon color="secondary"/>
                
                                        </Avatar>
                                    </ListItemAvatar>
                                <ListItemText primary={item.title} secondary={new Date(item.start).toDateString()} />  
                                </ListItem>
                            </Link>
                        )
                    }
                })}
            </List>
        </Paper>
    </>)
}
