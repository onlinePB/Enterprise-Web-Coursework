import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import {update, getComment} from './api-comments'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {Link} from 'react-router-dom'
import auth from './../auth/auth-helper'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}))

export default function Edit({ match }) {
    const classes = useStyles()
    const [comment, setComment] = useState([])
    const [redirect, setRedirect] = useState(false)
    const [values, setValues] = useState({
      message: comment.message,
      author: '',
      authorName: ''
    })
    
    useEffect(() => {
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

  const clickSubmit = () => {
    const commentUpdate = {
        message: values.message || undefined,
        author: auth.isAuthenticated().user._id || undefined,
        authorName: auth.isAuthenticated().user.name || undefined
    }
    update(comment._id, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id, commentUpdate).then((data) => {
        if (data && data.error) {
          //setValues({...values, error: data.error})
        } else {
          //setValues({...values, userId: data._id, redirectToProfile: true})
        }
    })
    setRedirect(true)
  }

  const cancel = () => {
    setRedirect(true)
  }

    // Redirect the user to the comments page once they're done editing
    if (redirect) {
        return <Redirect to='/comments/'/>
    }

    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Edit:
          </Typography>
          
          <TextField multiline fullWidth id="message" variant="outlined" label="Comment:" className={classes.textField} value={values.message} onChange={handleChange('message')} margin="normal"/><br/>

        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
          <Button color="primary" variant="contained" onClick={cancel} className={classes.submit}>Cancel</Button>
        </CardActions>
      </Card>
    </div>
    )
}