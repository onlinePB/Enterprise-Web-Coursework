import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import {update, getEvent} from './api-events'
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

export default function EventEdit({ match }) {
    const classes = useStyles()
    const [event, setEvent] = useState([])
    const [redirect, setRedirect] = useState(false)
    const [values, setValues] = useState({
      title: '',
      description: ''
    })
    
    useEffect(() => {
        // Gets the original event
        getEvent(match.params.eventID).then((data) => {
          if (data && data.error) {
            console.log(data.error)
          } else {
                setEvent(data)
              }
            })
    }, [])

   // Updates variables when the user enters new information
    const handleChange = message => event => {
        setValues({ ...values, [message]: event.target.value })
    }

  const clickSubmit = () => {
    const eventUpdate = {
        title: values.title || undefined,
        description: values.description|| undefined
    }
    update(event._id, {t: auth.isAuthenticated().token}, auth.isAuthenticated().user._id, eventUpdate).then((data) => {
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

    var editTitle = "\"" + event.title + "\""
    // Redirect the user to the events page once they're done editing
    if (redirect) {
        return <Redirect to='/events/'/>
    }

    return (<div>
    <Card className={classes.card}>
        <CardContent>
            <Typography variant="h6" className={classes.title}>
                {editTitle}
            </Typography>
            <Typography variant="body1">
                {event.description}
            </Typography>
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            {editTitle}
          </Typography>
          
          <TextField multiline fullWidth id="message" variant="outlined" label="New Title:" className={classes.textField} value={values.title} onChange={handleChange('title')} margin="normal"/><br/>
          <TextField multiline fullWidth id="message" variant="outlined" label="New Description:" className={classes.textField} value={values.description} onChange={handleChange('description')} margin="normal"/><br/>

        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
          <Button color="primary" variant="contained" onClick={cancel} className={classes.submit}>Cancel</Button>
        </CardActions>
      </Card>
    </div>
    )
}