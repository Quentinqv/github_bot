const Bot = require("./bot")

const run = async () => {
  const bot = new Bot()
  await bot.init().then(() => console.log("Init"))
  await bot.login().then(() => console.log("Login in"))
  await bot.searchFor().then(() => console.log("Ends of search"))
  await bot.end().then(() => console.log("Ends of bot"))
}

run()
