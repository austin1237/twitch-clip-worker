let request = require('request-promise');
let getServiceLocation = (serviceDiscovery) => {
    let options = {
        uri: `${serviceDiscovery}/services?serviceName=clip-service`,
        headers: {},
        json: true 
    }

    return request.get(options)
}

let saveClip = (baseURL, twitchClip) => {
    let clip = {
        clipUrl: twitchClip
    }
    let options = {
        method: 'POST',
        uri: `${baseURL}/clips`,
        headers: {"Content-Type": "application/json"},
        json: clip 
    }
    return request(options)
}

module.exports.getServiceLocation = getServiceLocation
module.exports.saveClip = saveClip






