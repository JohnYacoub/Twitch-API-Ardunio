const {createHmac} = require("crypto");
const { nextTick } = require("process");

const twitchSigningSecret = process.env.TWITCH_SIGNING_SECRET;

const verifyTwitchSignature = (req, res, buf, encoding,next)=>{

 
const messageId = req.header("Twitch-Eventsub-Message-Id");
const timeStamp = req.header("Twitch-Eventsub-Message-Timestamp")
const messageSignature = req.header("Twitch-Eventsub-Message-Signature")
const time = Math.floor(new Date().getTime() / 1000);


if(Math.abs(time - timeStamp)> 600){
  //needs to be less than 10 mins
  console.log(`Verification Failed: timeStamp is more 10 Minutes.`)
  throw new Error("Ignore this request!");
}

if (!twitchSigningSecret){
  console.log(`Twitch signing secret is empty`);
  throw new Error ("Twitch signing secret is empty.");

}


const computedSignature = "sha256=" + createHmac("sha256", twitchSigningSecret).update(messageId + timeStamp + buf).digest("hex");


if (messageSignature !== computedSignature) {
  throw new Error("Invalid Signature.");
}else {
console.log(messageSignature),
console.log(computedSignature),
  console.log("Verification Successful");

}


}

module.exports = verifyTwitchSignature