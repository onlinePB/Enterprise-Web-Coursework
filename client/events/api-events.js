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

export{
    list,
    getEvent
}