import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
    
    name:{
        type: String,
        trim: true,
        required: "A name is required."
    },

    description:{
        type: String,
        trim: true,
        required: "A name is required."
    },

    stock:{
        type: Number,
        min: 0,
        default: 1
    }

})

const shopModel = mongoose.model('Shop', CommentSchema);
shopModel.createIndexes();
export default shopModel