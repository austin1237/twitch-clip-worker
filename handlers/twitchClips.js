"use strict";
const twitchProvider = require("../providers/data/twitchProvider.js");
const clipProvider = require("../providers/data/clipProvider.js");
const clipAdapter = require("../adapters/clipAdapter.js");

module.exports.check = (event, context, callback) => {
  let testEnv = process.env.TEST;
  let twitchId = process.env.TWITCHID;
  let serviceDiscovery = process.env.SERVICEDISCOVERY;
  let streamer = process.env.STREAMER;
  let twitchClip = {};
  let promises = [
    twitchProvider.getTrending(streamer, twitchId),
    clipProvider.getServiceLocation(serviceDiscovery)
  ];
  Promise.all(promises)
    .then(results => {
      const twitchResponse = results[0].clips[0];
      const newClip = clipAdapter.transformClip(twitchResponse);
      const twitchClip = results[0].clips[0].url;
      const clipServiceLocation = results[1].url;
      return clipProvider.saveClip(clipServiceLocation, newClip);
    })
    .then(() => {
      callback(null, "clip added to db");
    })
    .catch(err => {
      console.log(err);
      const errResponse = {
        statusCode: 500,
        body: JSON.stringify(err)
      };

      callback(null, errResponse);
    });
};
