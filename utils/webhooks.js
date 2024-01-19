const fetch = require('node-fetch');


const sendDiscordNotification = async (url, data) => {

   var requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      "content": data
    }),
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json'
    },
  };

  // console.log(requestOptions);

  try {
    const result = await fetch(url, requestOptions)
    return result.text()
  } catch (error) {
    throw error
  }

};

const modifyUserTrait = async (url, data) => {
  
  var messagePayload = JSON.stringify(data);
  var requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic VF9IeTRfYzV1OVptVHBNZEJrbDFqQVJjWU9Cd1RpalpPbm9JM2VLRTZNODo=`,
    },
    body: messagePayload,
    redirect: 'follow',
  };

  try {
    const result = await fetch(url, requestOptions)
    return result.text()
  } catch (error) {
    throw error
  }

};

module.exports = {
  sendDiscordNotification,
  modifyUserTrait,
};
