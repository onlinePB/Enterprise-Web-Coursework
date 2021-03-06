import mongoose from 'mongoose'

// This schema models a comment record
const CommentSchema = new mongoose.Schema({
    // Comment body - the message contained in the comment
    message:{
        type: String,
        trim: true,
        required: "A message is required."
    },

    // The author of the comment's user ID
    author:{
        type: String,
        trim: true,
    },

    
    // The date the comment was created on
    created:{
        type: Date,
        default: Date.now,
    },

    // The date of the last edit to the comment
    lastUpdate:{
        type: Date,
    },

    // What the comment is replying to. When set to "root", the comment is a top level comment.
    replyTo:{
        type: String,
        trim: true,
        default: "root",
    },

    // The display name of the author of the comment
    authorName:{
        type: String,
        trim: true,
        required: "An author's name is required."
    }
})

const commentModel = mongoose.model('Comments', CommentSchema);
commentModel.createIndexes();
export default commentModel