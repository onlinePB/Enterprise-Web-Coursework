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

const getAllComments = async(req, res) => {
    try{
        let comments = await Comment.find().select('message author created lastUpdate replyTo')
        res.join(comments)
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

        req.usercomment = comment
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve comment"
        })
    }
}

// Updates a comment
const update = async(req, res) => {
    try{
        let comment = req.usercomment
        comment = extend(comment, req.body)
        comment.lastUpdate = Date.now()

        await comment.save()
        res.json(comment)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// Deletes a comment
const remove = async(req, res) => {
    try{
        let comment = req.usercomment
        let deletedComment = await comment.remove()
        
        res.join(deletedComment)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const read = (req, res) => {
    return res.json(req.usercomment)
  }

export default {
    create,
    getAllComments,
    getCommentByID,
    update,
    remove,
    read
}