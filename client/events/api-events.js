// Gets all events
const list = async (signal) => {
    try {
      let response = await fetch('/api/events/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

// Gets a particular event by it's ID
const getEvent = async(eventID) => {
    try {
      let response = await fetch('/api/event/' + eventID, {
        method: 'GET',
      })

      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

// Deletes a particular event
const remove = async (eventID, credentials, userID) => {
    try {
      let response = await fetch('/api/event/' + userID + "/" + eventID, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

// Creates a new event
const create = async (event, creds, userID) => {
    try {
        let response = await fetch('/api/events/' + userID, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + creds.t
          },
          body: JSON.stringify(event)
        })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

// Update an existing event
const update = async (eventID, credentials, userID, data) => {
    try {
      let response = await fetch('/api/event/' + userID + "/" + eventID, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

export{
    list,
    getEvent,
    remove,
    create,
    update
}