import ShopItem from '../models/shop.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
    const shopItem = new ShopItem(req.body)
    try {
      await shopItem.save()
      return res.status(200).json({
        message: "Successfully added a product"
      })
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }


const list = async (req, res) => {
    try {
      let shopItem = await ShopItem.find().select('_id name description stock')
      res.json(shopItem)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const productByID = async (req, res, next, id) => {
    try {
      let shopItem = await ShopItem.findById(id)
      if (!shopItem)
        return res.status('400').json({
          error: "Product not found"
        })
      req.product = user
      next()
    } catch (err) {
      return res.status('400').json({
        error: "Could not retrieve product"
      })
    }
  }

const read = (req, res) => {
    return res.json(req.product)
}

export default{
    create,
    list,
    productByID,
    read
}