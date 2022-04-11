import express from 'express'
import eventCtrl from '../controllers/event.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/api/events/:userID')
    .post(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, eventCtrl.create)

router.param('userID', userCtrl.userByID)