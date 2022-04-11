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
import EventIcon from '@material-ui/icons/Event';
import {Link} from 'react-router-dom'
import {list, listReplies} from './api-events'
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

export default function Users() {
  const classes = useStyles()
  const [events, setEvents] = useState([])
  const [attending, setAttending] = useState([])

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
    })

    listReplies(auth.isAuthenticated().user._id).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setAttending(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }
  }, [])



    return (<>
        <Paper>
          <List>
          {attending.map((item, i) => {
            return(
              <ListItem>{item.title}</ListItem>
            )
          })

          }
          </List>
        </Paper>
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
                                        <EventIcon />
                                    </Avatar>
                                </ListItemAvatar>
                            <ListItemText primary={item.title} secondary={new Date(item.start).toDateString()} />
                        </ListItem>
                    </Link>)
                })}
            </List>
        </Paper>
    </>)
}
