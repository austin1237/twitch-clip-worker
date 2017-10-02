# twitch-clip-worker
[![CircleCI](https://circleci.com/gh/austin1237/twitch-clip-worker.svg?style=svg)](https://circleci.com/gh/austin1237/twitch-clip-worker) <br />
A lamda function that checks a twitch channels most recent clips

## Prerequistes
You must have the following installed/configured for this to work correctly<br />
1. [Node v6.10 or greater](https://github.com/creationix/nvm)
2. [AWS CLI](https://github.com/aws/aws-cli)
3. [Serverless Framework](https://github.com/serverless/serverless)
4. [Twitch Client ID](https://dev.twitch.tv/docs/v5/guides/using-the-twitch-api)

## Dependencies
```bash
npm install
```

## Deployment
```bash
node deploy --twitchId="YOUR_TWITCH_CLIENT_ID"
```
