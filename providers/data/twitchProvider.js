const request = require("request-promise");
const util = require("util");

let getTrending = (channelName, twitchClientID) => {
  let options = {
    uri: `https://api.twitch.tv/kraken/clips/top?limit=1&channel=${channelName}`,
    headers: {
      Accept: "application/vnd.twitchtv.v5+json",
      "Client-ID": twitchClientID
    },
    json: true // Automatically parses the JSON string in the response
  };
  console.log("options are" + util.inspect(options, false, null));
  return request.get(options);
};

module.exports.getTrending = getTrending;
