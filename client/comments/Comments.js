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
import {create, remove} from './api-comments.js'
import CardHeader from '@material-ui/core/CardHeader';

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5),
    backgroundColor: theme.palette.primary.main
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  commentCard: {
    margin: `0px 0px 10px 0px`
  },
  inputBox: {
    margin: auto
  }
}))



export default function Comments() {
  const classes = useStyles()
  const [comments, setComments] = useState([])
  const [values, setValues] = useState({
    message: '',
    author: '',
    authorName: ''
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

    const handleChange = message => event => {
        setValues({ ...values, [message]: event.target.value })
    }

    const clickSubmit = () => {
        const comment = {
          message: values.message || undefined,
          author: auth.isAuthenticated().user._id || undefined,
          authorName: auth.isAuthenticated().user.name || undefined
        }
        
        create(comment, {t: auth.isAuthenticated().token}).then((data) => {
          if (data.error) {
            setValues({ ...values, error: data.error})
          } else {
            setValues({ ...values, error: '', open: true})
          }
          document.location.reload() //Reload the page so they can see their comment
        })
        
      }

    function deleteComment(commentID){
        remove(commentID, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id).then((data) =>{
            if (data.error) {
                setValues({ ...values, error: data.error})
              } else {
                setValues({ ...values, error: '', open: true})
              }
            document.location.reload()
        })
    }

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
                            <Card className={classes.commentCard}>
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

                      
                                    <CardActions>
                                        <Button component={Link} to={"/replies/" + item._id} size="small">Replies</Button>

                                        {auth.isAuthenticated() && <>
                                        {auth.isAuthenticated().user._id == item.author &&
                                            <>  
                                                <Button size="small" onClick={() => deleteComment(item._id)}>Delete</Button> 
                                            </>                   
                                        }</>}   
                                    </CardActions>
                                 
                            </Card>
                        </>
                    )     
                })
            }
            </List>
        </Paper>
        {auth.isAuthenticated() && <>
            <Card className={classes.inputBox}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Leave a comment!
                    </Typography>
                    <TextField multiline id="message" label="Comment:" className={classes.textField} value={values.message} onChange={handleChange('message')} margin="normal"/><br/>
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Post</Button>
                </CardActions>
            </Card>
        </>}
       </>
    )
}
