const Bot = require("./bot");

const run = async () => {
  const bot = new Bot();
  await bot.init().then(() => console.log("Init"));
};

run();
