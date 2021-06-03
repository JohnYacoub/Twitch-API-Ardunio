const express = require('express');
const eventSubs = require("../controllers/twitch.eventSub.controller")
let router = express.Router();
const ngrokURL = process.env.NGROK_URL


router.post('/createWebhook/:broadcasterId', eventSubs.listenToChannelFollowers)
router.post('/notification',eventSubs.getWebHookNotifications)

// router.get('/subevents', eventSubs.getSubEvents)
module.exports = router;
