'use strict';
const twitch = require('./twitch/trending.js');
const clipAPI = require('./clips/clips.js');

module.exports.index = (event, context, callback) => {
  let testEnv  = process.env.TEST;
  let twitchId = process.env.TWITCHID
  let serviceDiscovery = process.env.SERVICEDISCOVERY 
  let twitchClip = {};
  console.log(twitchId)
  let promises = [
    twitch.getTrending("drdisrespectlive", twitchId),
    clipAPI.getServiceLocation(serviceDiscovery)
  ]
  Promise.all(promises)
  .then((results) => {
   const twitchClip = results[0].clips[0].url;
   const clipServiceLocation = results[1].url;
   return clipAPI.saveClip(clipServiceLocation, twitchClip)
  }).then(() => {
    callback(null, 'clip added to db')
  }).catch((err) => {
    console.log(err)
    let errResponse = {
      statusCode: 500,
      body: JSON.stringify(err)
    }
     callback(null, errResponse)
  })
};
