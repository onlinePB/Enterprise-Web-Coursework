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

export default{
    create
}