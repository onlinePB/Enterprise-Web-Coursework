const list = async (signal) => {
    try {
      let response = await fetch('/api/shop/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

const getProduct = async(productID) => {
    try{
        let response = await fetch('/api/product/' + productID, {
            method: 'GET'
        })
        
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export {
    list,
    getProduct
}