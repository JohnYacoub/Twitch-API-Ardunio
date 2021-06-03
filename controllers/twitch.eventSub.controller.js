const {
  TWITCH_CLIENT_ID: clientId,
  TWITCH_SECRET: clientSecret,
  TWITCH_SCOPE_TYPE: ClientScope,
  TWITCH_ACCESS_TOKEN_URL: requestTokenURL,
  Twitch_TEMP_TOKEN: authToken,
  TWITCH_SIGNING_SECRET: webhookSecret
} = process.env

const axios = require('axios').default;
const ngrokURL = process.env.NGROK_URL
const arduinoFunctions = require('../arduinoFn/methods')


// Capn_brosef 609378159
// ProspectiongTonight 547905342
exports.listenToChannelFollowers = async (req, res, next) => {

console.log("ngrokURL from Subevent", process.env.NGROK_URL)
console.log(req.headers)

  try {
    const createWebHookBody = {
      "type": "channel.follow",
      "version": "1",
      "condition": {
        "broadcaster_user_id": req.params.broadcasterId
      },
      "transport": {
        "method": "webhook",
        "callback": `${ngrokURL}/twitch/notification`,
        "secret": webhookSecret // 
      }
    }
    const options = {
      url: 'https://api.twitch.tv/helix/eventsub/subscriptions',
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Client-ID": clientId,
        "Authorization": "Bearer " + authToken
      },
      data: createWebHookBody
    }

    const response = await axios(options);
    console.log("success firing user", response.data)


    
      res.send(response.data)

  } catch (error) {
 
    res.send(error)
  }

};

// handling incoming notifications 
exports.getWebHookNotifications = async (req, res) => {



  console.log("body",req.body)

  const messageType = req.header("Twitch-Eventsub-Message-Type");
  if (messageType === "webhook_callback_verification") {
    console.log("Verifying Webhook compeleted & acknowledged");

    return res.status(200).send(req.body.challenge);
  }

  const {
    type
  } = req.body.subscription;
  const {
    event
  } = req.body;

  // arduio logic goes here...
  if (messageType === "notification") {
    arduinoFunctions.ledDrawHeart()
  }

  console.log(
    `Receiving ${type} request for ${event.broadcaster_user_name} - from ${event.user_name}: `,
    event
  );
  notification=event.user_name
  console.log(notification)


 
// eventArray.push({followerName:event.user_name,followedAt:event.followed_at})
//  console.log("that's my global event array",eventArray)

  res.status(200).end();
  // res.render('index',{connetionStatus:connetionStatus, type: type}).end()
}
// exports.getSubEvents = async (req, res) => {
// console.log("res", res, "req",req)
//   console.log(`here are the current list  : ${eventArray}`)

//   // res.status(200).send(response)

// }