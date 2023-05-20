const request = require("request");
const delay = require("delay");
const config = require("./config.js");
console.log("\n");
console.log('\x1b[31m%s\x1b[0m', '.__             _____                      __                 .___                    .__                            ');
console.log('\x1b[31m%s\x1b[0m', '|__|   ____   _/ ____\\   ____     ____   _/  |_    ____     __| _/    ______   ____   |__| ______     ____   _______ ');
console.log('\x1b[31m%s\x1b[0m', '|  |  /    \\  \\   __\\  _/ __ \\  _/ ___\\  \\   __\\ _/ __ \\   / __ |    /  ___/  /    \\  |  | \\____ \\  _/ __ \\  \\_  __ \\');
console.log('\x1b[31m%s\x1b[0m', '|  | |   |  \\  |  |    \\  ___/  \\  \\___   |  |   \\  ___/  / /_/ |    \\___ \\  |   |  \\ |  | |  |_> > \\  ___/   |  | \\/');
console.log('\x1b[31m%s\x1b[0m', '|__| |___|  /  |__|     \\___  >  \\___  >  |__|    \\___  > \\____ |   /____  > |___|  / |__| |   __/   \\___  >  |__|   ');
console.log('\x1b[31m%s\x1b[0m', '          \\/                \\/       \\/               \\/       \\/        \\/       \\/       |__|          \\/          ');
console.log('\x1b[31m%s\x1b[0m', '                                                                                                               ');
console.log('\x1b[31m%s\x1b[0m', '                               > I N F E C T E D#0007                                            \n');
console.log('\x1b[31m%s\x1b[0m', '                               > https://github.com/zaddyinfected                             \n');


const token = config.token;
const guildId = config.guildId;
const webhookUrl = config.webhookUrl;
const vanityUrl = config.vanityUrl;

const headers = {
  "authorization": token,
  "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
};

async function checkVanity() {
  while (true) {
    try {
      if (vanityUrl === "") {
        console.log('\x1b[36m%s\x1b[0m', "> Vanity URL is empty, waiting for a new URL...");
      } else {
        request.get({
          url: `https://discord.com/api/v9/invites/${vanityUrl}?with_counts=true&with_expiration=true`,
          headers: headers
        }, (error, response, body) => {
          if (response && response.statusCode == 404) {
            console.log('\x1b[36m%s\x1b[0m', `> Changing Vanity URL: ${vanityUrl}`);
            changeVanity();
          } else {
            console.log('\x1b[36m%s\x1b[0m', `> Vanity URL still active: ${vanityUrl}`);
          }
        });
      }
      await delay(200);
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', "> Rate limited :(");
      await delay(5000);
    }
  }
}

function changeVanity() {
  const payload = { "code": vanityUrl };
  request.patch({
    url: `https://discord.com/api/v10/guilds/${guildId}/vanity-url`,
    headers: headers,
    json: payload
  }, (error, response, body) => {
    if (response.statusCode == 200) {
      console.log('\x1b[36m%s\x1b[0m', `> URL changed: ${vanityUrl}`);
      const data = {
        content: `@everyone discord.gg/${vanityUrl} yours now!`,
        username: "I N F E C T E D",
        avatar_url: "https://i.imgur.com/aOuh37s.jpg"
      };
      request.post({
        url: webhookUrl,
        json: data
      }, () => {
        process.exit();
      });
    } else {
      console.log('\x1b[36m%s\x1b[0m', `> Vanity URL could not be changed, error code: ${response.statusCode}`);
    }
  });
}

checkVanity();
