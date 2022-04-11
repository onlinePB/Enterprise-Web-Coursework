  const list = async (signal) => {
    try {
      let response = await fetch('/api/comments/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

const listReplies = async(commentID) => {
    try{
        let response = await fetch('/api/replies/' + commentID, {
            method: 'GET',
        })

        return await response.json()
    } catch(err) {
        console.log(err)
    }
}
 

  const create = async (comment, creds) => {
    try {
        let response = await fetch('/api/comments/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + creds.t
          },
          body: JSON.stringify(comment)
        })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

    
  const remove = async (commentID, credentials, userID) => {
    try {
      let response = await fetch('/api/comment/' + userID + "/" + commentID, {
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
  

  
  export {
    list,
    create,
    remove
  }
  