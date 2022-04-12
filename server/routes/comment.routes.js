import express from 'express'
import commentCtrl from '../controllers/comment.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

// GET: Gets all comments
// POST: Creates a new comment
router.route('/api/comments')
    .get(commentCtrl.list)
    .post(authCtrl.requireSignin, commentCtrl.create)

// GET: Gets a particular comment using it's ID
router.route('/api/comments/:commentID')
    .get(commentCtrl.read)

// GET: Gets all replies to a comment using the original comment's ID
router.route('/api/replies/:commentID')
    .get(commentCtrl.listReplies)

// DELETE: Deletes a comment from the database
// GET: Gets a particular comment using it's ID
// PUT: Updates a comment
router.route('/api/comment/:userID/:commentID')
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.read)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.remove)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.update)

router.param('commentID', commentCtrl.getCommentByID)
router.param('userID', userCtrl.userByID)

export default router