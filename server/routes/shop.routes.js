import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'

const router = express.Router()

router.route('/api/shop')
    .get(shopCtrl.list)
    

router.route('/api/shop/:userID')
    .post(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, shopCtrl.create)

router.route('/api/product/:itemID')
    .post(shopCtrl.read)

router.param('userID', userCtrl.userByID)
router.param('itemID', shopCtrl.productByID)
export default router