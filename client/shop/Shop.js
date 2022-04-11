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
import {list, get, getProduct} from './api-shop.js'
import ImageIcon from '@material-ui/icons/Image';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import auth from './../auth/auth-helper'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';

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


export default function Shop() {
  const classes = useStyles()
  const [products, setProducts] = useState([])
  var basket = []

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }
    })

    if (sessionStorage.getItem("basket") === null){
        sessionStorage.setItem("basket", JSON.stringify([]))
    } else {
        basket = JSON.parse(sessionStorage.getItem("basket"))
    }

    return function cleanup(){
      abortController.abort()
    }
  }, [])

  function toggleBasket(itemID){
    if (basket.includes(itemID)){
        basket.splice(basket.indexOf(itemID), 1)
    } else {
        basket.push(itemID)
    }

    sessionStorage.setItem("basket", JSON.stringify(basket))
  }


    return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          All Products
        </Typography>
        <List className={classes.root}>
         {products.map((item, i) => {
          return (<>  
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <ImageIcon />
                            </Avatar>
                        </ListItemAvatar>
                    <ListItemText primary={item.name} secondary={item.description} />
                    {auth.isAuthenticated() &&
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="basket" color="secondary" onClick={() => toggleBasket(item._id)}>
                            {!basket.includes(item._id) &&
                                <AddShoppingCartIcon/>
                            }
                            {basket.includes(item._id) &&
                                <RemoveShoppingCartIcon />
                            }
                        </IconButton>
                    </ListItemSecondaryAction>
                    }
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </>)
               })
             }
        </List>
      </Paper>
    )
}
