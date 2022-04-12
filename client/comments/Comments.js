import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import {list} from './api-comments.js'
import Card from '@material-ui/core/Card';
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
    backgroundColor: theme.palette.primary.light
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  commentTitle: {
    color: `#ffffff`
  },
  commentCard: {
    margin: `0px 0px 10px 0px`
  },
  inputBox: {
    backgroundColor: theme.palette.primary.light,
    color: `#ffffff`
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

    // Load all the comments
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

  // Updates variables when user inputs new information
  const handleChange = message => event => {
      setValues({ ...values, [message]: event.target.value })
  }

  // This function is executed when the submit button to post a comment is clicked
  const clickSubmit = () => {
    const comment = {
      message: values.message || undefined,
      author: auth.isAuthenticated().user._id || undefined,
      authorName: auth.isAuthenticated().user.name || undefined
    }
        
    // Create a new comment in the database
    create(comment, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        setValues({ ...values, error: '', open: true})
      }
        document.location.reload() //Reload the page so they can see their comment
    })
        
  }

  // This function is executed when the delete button on a comment is clicked
  function deleteComment(commentID){
    // Delete the comment from the database
    remove(commentID, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id).then((data) =>{
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        setValues({ ...values, error: '', open: true})
      }
      document.location.reload()
    })
  }

  // Render the page
  return (<>
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.commentTitle}>
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
                    {auth.isAuthenticated().user._id == item.author && <>  
                      <Button component={Link} to={"/edit/" + item._id} size="small">Edit</Button>
                      <Button size="small" onClick={() => deleteComment(item._id)}>Delete</Button> 
                    </>}
                  </>}   
              </CardActions>                           
            </Card>
            </>
          )     
        })}
      </List>
    </Paper>

    {auth.isAuthenticated() && <>
      <Card className={classes.inputBox}>
        <CardContent>
          <Typography variant="h6" className={classes.commentTitle}>
            Leave a comment!
          </Typography>
          <TextField multiline fullWidth id="message" variant="outlined" label="Comment:" className={classes.textField} value={values.message} onChange={handleChange('message')} margin="normal"  inputProps={{ style: { color: "white" } }} InputLabelProps={{style : {color : 'white'} }}/><br/>
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
            You must be signed in to leave a comment.
          </Typography>
        </CardContent>
      </Card>
    </>}
  </>)
}
