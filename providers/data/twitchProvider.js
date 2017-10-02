let getTrending = (request, channelName, twitchClientID) => {
  let options = {
    uri: `https://api.twitch.tv/kraken/clips/top?limit=1&channel=${channelName}`,
    headers: {
      Accept: "application/vnd.twitchtv.v5+json",
      "Client-ID": twitchClientID
    },
    json: true // Automatically parses the JSON string in the response
  };
  return new Promise((resolve, reject) => {
    request
      .get(options)
      .then(clipData => {
        if (!clipData.clips || !clipData.clips.length) {
          return reject(
            new Error(`No clips for ${channelName} sent from twitch`)
          );
        }
        return resolve(clipData.clips);
      })
      .catch(reject);
  });
};

module.exports.getTrending = getTrending;
