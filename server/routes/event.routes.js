import express from 'express'
import eventCtrl from '../controllers/event.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

// Public routes
router.route('/api/events')
    .get(eventCtrl.list)

router.route('/api/event/:eventID')
    .get(eventCtrl.read)

// Authenticated routes
router.route('/api/events/:userID')
    .post(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, eventCtrl.create)

router.route('/api/attending/:userID')
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, eventCtrl.listByAttending)

router.route('/api/event/:userID/:eventID')
    .put(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, eventCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, eventCtrl.remove)

router.param('userID', userCtrl.userByID)
router.param('eventID', eventCtrl.getEventByID)

export default router