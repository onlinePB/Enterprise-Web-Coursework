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
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import auth from './../auth/auth-helper'
import TextField from '@material-ui/core/TextField'

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
  const [values, setValues] = useState({
    message: ''
    })
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
        <>
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
                                        {item.message}
                                    </Typography>
                                </CardContent>

                                {auth.isAuthenticated() &&
                                    <CardActions>
                                        <Button size="small">Reply</Button>

                                        
                                        {auth.isAuthenticated().user._id == item.author &&
                                            <Button size="small">Edit</Button>                    
                                        }
                                        
                                    </CardActions>
                                }   
                            </Card>
                        </>
                    )     
                })
            }
            </List>
        </Paper>
        {auth.isAuthenticated() && <>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Comment
                    </Typography>
                    <TextField id="message" label="Name" className={classes.textField} value={values.message} onChange={handleChange('message')} margin="normal"/><br/>
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Post</Button>
                </CardActions>
            </Card>
        </>}
       </>
    )
}
