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
import {create, remove} from './api-comments.js'
import CardHeader from '@material-ui/core/CardHeader';
import {listReplies} from './api-comments.js'

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

export default function Replies(){
    const classes = useStyles()
    const [replies, setReplies] = useState([])
    const [values, setValues] = useState({
        message: '',
        author: '',
        authorName: ''
    })

    useEffect(() => {
    
        listReplies(match.params.commentID).then((data) => {
          if (data && data.error) {
            console.log(data.error)
          } else {
            setReplies(data)
          }
        })
    }, [])

    return (
        <>
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
            Replies
            </Typography>
            <List dense>
                {replies.map((item, i) => {
                    return (
                        <>
                            <Card>
                            <CardHeader title={item.authorName} subheader={new Date(item.created).toDateString()} avatar={
                                <Avatar aria-label="recipe" className={classes.avatar}>
                                    {item.authorName.charAt(0)}
                                </Avatar>
                            }/>
                                    
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.message}
                                    </Typography>          
                                </CardContent>

                                {auth.isAuthenticated() &&
                                    <CardActions>
                                        <Button component={Link} to={"/replies/" + item._id} size="small">Replies</Button>

                                        
                                        {auth.isAuthenticated().user._id == item.author &&
                                            <>  
                                                <Button size="small" onClick={() => deleteComment(item._id)}>Delete</Button> 
                                            </>                   
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
       </>
    )
    
}