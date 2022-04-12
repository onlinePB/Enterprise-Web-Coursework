import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import auth from './../auth/auth-helper'
import TextField from '@material-ui/core/TextField'
import {create, remove} from './api-comments.js'
import CardHeader from '@material-ui/core/CardHeader';
import {listReplies, getComment} from './api-comments.js'

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
  replyCard: {
    margin: `0px 0px 10px 0px`
  },
  replyTitle: {
    color: `#ffffff`
  },
  inputBox: {
    backgroundColor: theme.palette.primary.light,
    color: `#ffffff`
  }
}))

export default function Replies({ match }){
  const classes = useStyles()
  const [replies, setReplies] = useState([])
  const [comment, setComment] = useState([])
  const [values, setValues] = useState({
    message: '',
    author: '',
    authorName: ''
  })

  useEffect(() => {
    // Gets all replies to the comment
    listReplies(match.params.commentID).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setReplies(data)
      }
    })
        
    // Gets the original comment
    getComment(match.params.commentID).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
            setComment(data)
          }
        })
    }, [])

    // Updates variables when the user enters new information
    const handleChange = message => event => {
        setValues({ ...values, [message]: event.target.value })
    }

    // This function is ran when the user posts a new reply
    const clickSubmit = () => {
      const reply = {
        message: values.message || undefined,
        author: auth.isAuthenticated().user._id || undefined,
        authorName: auth.isAuthenticated().user.name || undefined, 
        replyTo: match.params.commentID || undefined
      }
        
      // Create a new reply
      create(reply, {t: auth.isAuthenticated().token}).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error})
        } else {
          setValues({ ...values, error: '', open: true})
        }

        document.location.reload() //Reload the page so they can see their comment
      })     
    }

    // This function is ran when the user clicks delete on one of their replies
    function deleteReply(replyID){
      // Delete the reply from the database
      remove(replyID, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id).then((data) =>{
        if (data.error) {
          setValues({ ...values, error: data.error})
        } else {
          setValues({ ...values, error: '', open: true})
        }
        document.location.reload()
      })
    }

    return (<>
              <Card>
                <CardHeader title={comment.authorName} subheader={new Date(comment.created).toDateString()} avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {String(comment.authorName).charAt(0)}
                    </Avatar>
                }/>
                                    
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {comment.message}
                  </Typography>          
                </CardContent>
              </Card>
              
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.replyTitle}>
            Replies
            </Typography>
            <List dense>
                {replies.map((item, i) => {
                    return (
                        <>
                            <Card className={classes.replyCard}>
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
                                        
                                        {auth.isAuthenticated().user._id == item.author &&
                                            <>  
                                                <Button size="small" onClick={() => deleteReply(item._id)}>Delete</Button> 
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
        {auth.isAuthenticated() && <>
            <Card className={classes.inputBox}>
                <CardContent>
                    <Typography variant="h6" className={classes.replyTitle}>
                        Leave a reply!
                    </Typography>
                    <TextField multiline fullWidth id="message" variant="outlined" label="Reply:" className={classes.textField} value={values.message} onChange={handleChange('message')} margin="normal"  inputProps={{ style: { color: "white" } }} InputLabelProps={{style : {color : 'white'} }}/><br/>
                </CardContent>
                <CardActions>
                    <Button color="secondary" variant="contained" onClick={clickSubmit} className={classes.submit}>Post</Button>
                </CardActions>
            </Card>
        </>}

        {!auth.isAuthenticated() && <>
            <Card className={classes.inputBox}>
                <CardContent>
                    <Typography variant="h6" className={classes.commentTitle}>
                        You must be signed in to leave a reply.
                    </Typography>
                </CardContent>
            </Card>
        </>}
       </>
    )
    
}