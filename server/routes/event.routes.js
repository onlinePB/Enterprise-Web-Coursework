import express from 'express'
import eventCtrl from '../controllers/event.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

// Public routes
// GET: Lists all events
router.route('/api/events')
    .get(eventCtrl.list)

// GET: Gets a particular event using it's ID
router.route('/api/event/:eventID')
    .get(eventCtrl.read)

// Authenticated routes
// POST: Creates a new event
router.route('/api/events/:userID')
    .post(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, eventCtrl.create)

// PUT: Updates an existing event
// DELETE: Deletes an existing event
router.route('/api/event/:userID/:eventID')
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, eventCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, eventCtrl.remove)

router.param('userID', userCtrl.userByID)
router.param('eventID', eventCtrl.getEventByID)

export default router