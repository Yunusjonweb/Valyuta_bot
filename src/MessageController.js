const { default: axios } = require("axios");
const { CBUURL } = require("../config");
const CurrencyController = require("./Controller/CurrencyController");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;

    if (text == "💵 Valyuta kurslari") {
      await CurrencyController(bot, message, user);
    } else if (user.step == "currency") {
      if (
        message.text === "USD" ||
        message.text === "EUR" ||
        message.text === "RUB"
      ) {
        const currencyCode = message.text;

        axios
          .get(CBUURL)
          .then((response) => {
            const currencyData = response.data;
            const currency = currencyData.find((c) => c.Ccy === currencyCode);

            if (currency) {
              const replyText = `${currency.CcyNm_UZ} - ${currency.Rate} UZS`;
              bot.sendMessage(userId, replyText);
            } else {
              bot.sendMessage(userId, "Belirtilen para birimi bulunamadı.");
            }
          })
          .catch((error) => {
            console.log(error);
            bot.sendMessage(
              userId,
              "Valyuta kurslarini olishda xatolik yuz berdi."
            );
          });
      }
    }
  } catch (err) {
    console.log(err.toString());
  }
};
