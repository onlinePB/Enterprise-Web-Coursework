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