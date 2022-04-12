// Gets all comments
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

// Gets all replies to a particular comment
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

// Gets a particular comment
const getComment = async(commentID) => {
  try {
    let response = await fetch('/api/comments/' + commentID, {
      method: 'GET',
    })

    return await response.json()
  } catch(err) {
    console.log(err)
  }
}
 
// Creates a new comment
const create = async (comment, creds, userID) => {
  try {
      let response = await fetch('/api/comment/' + userID, {
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

// Deletes a comment
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

// Updates a comment
const update = async (commentID, credentials, userID, data) => {
  try {
    let response = await fetch('/api/comment/' + userID + "/" + commentID, {
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
   
export {
  list,
  create,
  remove,
  listReplies,
  getComment,
  update
}
  