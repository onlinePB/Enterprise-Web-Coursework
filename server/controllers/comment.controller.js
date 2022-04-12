import Comments from '../models/comment.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

// Creates a new comemnt
const create = async (req, res) => {
    const comment = new Comments(req.body)

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

// Gets all comments
const list = async (req, res) => {
    try {
      let comment = await Comments.find({replyTo: "root"}).select('_id message author replyTo created authorName')
      res.json(comment)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  

// Searches for a comment by its ID
const getCommentByID = async(req, res, next, id) => {
    try{
        let comment = await Comments.findById(id)

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

// Gets all replies to a particular comment
const listReplies = async(req, res) => {
    try{
        let comment = req.usercomment
        let reply = await Comments.find({replyTo: comment._id}).select('_id message author replyTo created authorName')
        res.json(reply)
    } catch (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
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
        
        res.json(deletedComment)
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// Returns a particular comment
const read = (req, res) => {
    return res.json(req.usercomment)
  }

export default {
    create,
    list,
    getCommentByID,
    update,
    remove,
    read,
    listReplies
}