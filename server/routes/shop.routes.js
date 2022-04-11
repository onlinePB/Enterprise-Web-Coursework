import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'

const router = express.Router()

// Public routes
router.route('/api/shop')
    .get(shopCtrl.list)
    
router.route('/api/product/:itemID')
    .get(shopCtrl.read)

// Authenticated Routes
router.route('/api/shop/:userID')
    .post(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, shopCtrl.create)

router.route('/api/product/:userID/:itemID')
    .delete(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, shopCtrl.remove)
    .put(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, shopCtrl.update)
    
router.param('userID', userCtrl.userByID)
router.param('itemID', shopCtrl.productByID)
export default router