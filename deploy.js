const exec = require("child_process").exec;
const spawn = require("child_process").spawn;
const _ = require("lodash");
const argv = require("minimist")(process.argv.slice(2));
let stage = argv.stage || "dev";
let region = argv.region || "us-east-1";
let twitchId = argv.twitchId;
let streamer = argv.streamer;

let validateCliArgs = () => {
  if (!twitchId) {
    console.log("--twitchId is required");
    process.exit(1);
  }

  if (!streamer) {
    console.log("--streamer is required");
    process.exit(1);
  }
};

let getAllApiEndpoints = () => {
  return new Promise((resolve, reject) => {
    const child = exec(
      `aws apigateway  get-rest-apis --region="${region}"`,
      (error, stdout, stderr) => {
        let apiEndpoints = JSON.parse(stdout);
        if (error !== null) {
          console.log(`exec error: ${error}`);
          process.exit(1);
        }
        return resolve(apiEndpoints.items);
      }
    );
  });
};

let findServiceDiscovery = apiEndpoints => {
  let discoveryId = "";
  _.each(apiEndpoints, api => {
    if (api.name === `${stage}-discovery-service`) {
      discoveryId = api.id;
    }
  });

  if (discoveryId === "") {
    console.log("service discovery not found exiting");
    process.exit(1);
  }

  let serviceDiscovery = `https://${discoveryId}.execute-api.${region}.amazonaws.com/${stage}`;
  return serviceDiscovery;
};

let deployServerless = serviceDiscovery => {
  let err = false;
  return new Promise((resolve, reject) => {
    let cliArgs = [
      "deploy",
      `--twitchId=${twitchId}`,
      `--serviceDiscovery=${serviceDiscovery}`,
      `--streamer=${streamer}`
    ];
    serverlessDeploy = spawn("serverless", cliArgs);

    serverlessDeploy.stdout.on("data", function(data) {
      console.log(data.toString());
    });

    serverlessDeploy.stderr.on("data", function(data) {
      console.log("stderr: " + data.toString());
      err = true;
    });

    serverlessDeploy.on("exit", function(code) {
      if (!err) {
        return resolve();
      } else {
        return reject();
      }
      console.log("child process exited with code " + code.toString());
    });
  });
};

let deploy = () => {
  validateCliArgs();
  console.log("looking up service discovery");
  getAllApiEndpoints()
    .then(apiEndpoints => {
      serviceDiscovery = findServiceDiscovery(apiEndpoints);
      console.log("service discovery found");
      console.log("deploying with serverless");
      return deployServerless(serviceDiscovery);
    })
    .then(() => {
      console.log("deploy finished");
      process.exit();
    })
    .catch(err => {
      console.log("An error occured" + err);
      process.exit();
    });
};

deploy();
