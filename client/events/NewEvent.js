import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import {create} from './api-events'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {Link} from 'react-router-dom'
import auth from './../auth/auth-helper'
import {read} from '../user/api-user'
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

export default function NewEvent() {
    const [redirect, setRedirect] = useState(false)
    const classes = useStyles()
    const [user, setUser] = useState({})
    const [values, setValues] = useState({
        title: '',
        description: ''
  })

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

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

  if(!user.admin){
      setRedirect(true)
  }
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    const event = {
      title: values.title,
      description: values.description
    }

    create(event, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        setValues({ ...values, error: '', open: true})
      }
    })
  }

    if (redirect) {
        return <Redirect to='/events/'/>
    }

    return (<div>

        
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            New Event
          </Typography>
          <TextField id="title" label="title" className={classes.textField} value={values.title} onChange={handleChange('title')} margin="normal"/><br/>
          <TextField id="description" label="description" className={classes.textField} value={values.description} onChange={handleChange('description')} margin="normal"/><br/>
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
      <Dialog open={values.open} disableBackdropClick={true}>
        <DialogTitle>Events</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New event successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/events">
            <Button color="primary" autoFocus="autoFocus" variant="contained">
              Events
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
    )
}