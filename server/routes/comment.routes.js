import express from 'express'
import commentCtrl from '../controllers/comment.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/comments')
    .get(commentCtrl.list)
    .post(authCtrl.requireSignin, commentCtrl.create)

    
router.route('/api/comments/:commentID')
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.remove)

router.param('commentID', commentCtrl.getCommentByID)

/*
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, commentCtrl.update)
    */
//TODO add routes for comments by user

export default router