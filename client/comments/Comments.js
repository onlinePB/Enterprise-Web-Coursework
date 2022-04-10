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
import {list} from './api-comments.js'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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

export default function Comments() {
  const classes = useStyles()
  const [comments, setComments] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setComments(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }
  }, [])


    return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Comments
        </Typography>
        <List dense>
            {comments.map((item, i) => {
                return (
                    <>
                        <Card>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    item.message
                                </Typography>
                            </CardContent>

                            <CardActions>
                                <Button size="small">Reply</Button>
                                {auth.isAuthenticated().user._id == item.author &&
                                    <Button size="small">Edit</Button>                    
                                }
                                
                            </CardActions>
                        </Card>
                    </>
                )     
            })
        }
        </List>
      </Paper>
    )
}
