const users = require("../Model/Users");

module.exports = async function (bot, message, user) {
  const chatID = message.from.id;
  const firstName = message.from.first_name;
  try {
    if (!user) {
      user = await users.create({
        user_id: chatID,
        step: "1",
      });

      bot.sendMessage(chatID, `Assalomu aleykum ${firstName}!\nXush kelibsiz!`);
    }
  } catch (e) {
    console.log(e + "");
  }
};
