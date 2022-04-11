import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
    // Name of the event
    title:{
        type: String,
        trim: true,
        required: "A title is required."
    },

    // The event's description
    description:{
        type: String,
        trim: true
    },

    // The date of the event
    start:{
        type: Date
    },

    // How many people have clicked on the event
    views: {
        type: Number,
        default: 0,
        min: 0
    },

    attendees: {
        type: Array,
        default: [""]
    },

    attendeesCount: {
        type: Number,
        default: 0,
        min: 0
    }
})

const eventModel = mongoose.model('Events', CommentSchema);
eventModel.createIndexes();
export default eventModel