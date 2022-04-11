import express from 'express'
import commentCtrl from '../controllers/comment.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/api/comments')
    .get(commentCtrl.list)
    .post(authCtrl.requireSignin, commentCtrl.create)

router.route('/api/replies/:commentID')
    .get(commentCtrl.listReplies)

router.route('/api/comment/:userID/:commentID')
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.read)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.remove)

router.param('commentID', commentCtrl.getCommentByID)
router.param('userID', userCtrl.userByID)

/*
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.update)
    */
//TODO add routes for comments by user

export default router