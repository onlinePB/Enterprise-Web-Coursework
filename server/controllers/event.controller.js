import Events from '../models/event.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

// Creates a new comemnt
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

const list = async (req, res) => {
    try {
      let event = await Events.find().select('_id title description start views attendees')
      res.json(event)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const read = (req, res) => {
    return res.json(req.event)
}

const getEventByID = async(req, res, next, id) => {
    try{
        let event = await Events.findById(id)

        if(!event){
            return res.status('400').json({
                error: "Event not found"
            })
        }

        req.event = event
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve event"
        })
    }
}

export default{
    create,
    list,
    read,
    getEventByID
}