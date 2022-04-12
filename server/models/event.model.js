import mongoose from 'mongoose'

// This scheme models an Event record
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
        type: Date,
        default: Date.now,
    },

    // How many people have clicked on the event
    views: {
        type: Number,
        default: 0,
        min: 0
    },

    // List of users who are attending in the form of an array of user IDs
    attendees: {
        type: Array,
        default: [""]
    },

    // A count of the amount of people attending the event
    attendeesCount: {
        type: Number,
        default: 0,
        min: 0
    }
})

const eventModel = mongoose.model('Events', CommentSchema);
eventModel.createIndexes();
export default eventModel