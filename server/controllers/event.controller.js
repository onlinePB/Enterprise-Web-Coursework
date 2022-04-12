import Events from '../models/event.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

// Creates a new event
const create = async (req, res) => {
    const event = new Events(req.body)

    try {
        await event.save()

        return res.status(200).json({
            message: "Event posted!"
        })
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// Gets all events
const list = async (req, res) => {
    try {
      let event = await Events.find().select('_id title description start views attendees attendeesCount')
      res.json(event)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

// Gets a particular event
const read = (req, res) => {
    let event = req.eventProfile
    event.views = event.views + 1
    event.save()
    return res.json(req.eventProfile)
}

// Searches for a particular event using it's ID
const getEventByID = async(req, res, next, id) => {
    try{
        let event = await Events.findById(id)

        if(!event){
            return res.status('400').json({
                error: "Event not found"
            })
        }

        req.eventProfile = event
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve event"
        })
    }
}

// Updates an existing event
const update = async(req, res) => {
    try{
        let event = req.eventProfile
        event = extend(event, req.body)
        await event.save()
        res.json(event)

    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// Deletes an event
const remove = async(req, res) => {
    try{
        let event = req.eventProfile
        let deletedEvent = await event.remove()
        
        res.json(deletedEvent)
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default{
    create,
    list,
    read,
    getEventByID,
    update,
    remove
}