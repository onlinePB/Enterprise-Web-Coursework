import Comment from '../models/comment.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

// Creates a new comemnt
const create = async (req, res) => {
    const comment = new Comment(req.body)

    try {
        await comment.save()

        return res.status(200).json({
            message: "Comment posted!"
        })
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// Searches for a comment by its ID
const getCommentByID = async(req, res, next, id) => {
    try{
        let comment = await Comment.findById(id)

        if(!comment){
            return res.status('400').json({
                error: "Comment not found"
            })
        }

        req.message = comment
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve comment"
        })
    }
}