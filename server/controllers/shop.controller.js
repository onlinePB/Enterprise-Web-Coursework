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

export default{
    create
}