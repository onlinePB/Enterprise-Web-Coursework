import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
    // Comment body - the message contained in the comment
    body:{
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
    date:{
        type: Date,
        default: Date.now,
    },

    // What the comment is replying to. When set to "root", the comment is a top level comment.
    replyTo:{
        type: String,
        trim: true,
        default: "root",
    },

})