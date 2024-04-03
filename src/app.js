const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const { TOKEN, CBUURL } = require("../config");

const bot = new TelegramBot(TOKEN, { polling: true });

const menuKeyboard = [
  [{ text: "💵 Valyuta kurslari" }, { text: "🔄 Konvertatsiya kalkulyator" }],
  [{ text: "🤖 Bot haqida takliflar" }],
];
const backKeyboard = [{ text: "🔙 Orqaga" }];

bot.getMe().then((info) => {
  console.log("Bot haqida malumot:", info);
});

bot.onText(/\/start/, (msg) => {
  axios
    .get(CBUURL)
    .then((response) => {
      const options = {
        reply_markup: {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: menuKeyboard,
        },
      };

      const firstName = msg.from.first_name;

      bot.sendMessage(
        msg.chat.id,
        `Assalomu aleykum ${firstName}!\nXush kelibsiz!`,
        options
      );
    })
    .catch((error) => {
      console.log(error);
      bot.sendMessage(
        msg.chat.id,
        "Valyuta kurslarini olishda xatolik yuz berdi."
      );
    });
});

bot.on("message", async (msg) => {
  const { text } = msg;

  if (text === "💵 Valyuta kurslari") {
    axios
      .get(CBUURL)
      .then((response) => {
        const currencyData = response.data;
        console.log(currencyData, 99);
        const options = {
          reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
              [{ text: "USD" }, { text: "EUR" }, { text: "RUB" }],
              backKeyboard,
            ],
          },
        };
        bot.sendMessage(msg.chat.id, "Iltimos valyutani tanlang 💵", options);
      })
      .catch((error) => {
        console.log(error);
        bot.sendMessage(
          msg.chat.id,
          "Valyuta kurslarini olishda xatolik yuz berdi."
        );
      });
  } else if (text === "🔄 Konvertatsiya kalkulyator") {
    const options = {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [[{ text: "🇺🇿 O'zbek so'mida" }], backKeyboard],
      },
    };

    bot.sendMessage(
      msg.chat.id,
      "Qiymat kiritiladigan valyutani tanlang",
      options
    );
  } else if (text == "🤖 Bot haqida takliflar") {
    let keyboard = {
      inline_keyboard: [
        [
          {
            text: "✍️ Murojaat yozish",
            url: "https://t.me/yunusbekxabibullayev",
          },
        ],
      ],
    };
    await bot.sendMessage(
      msg.chat.id,
      `Ushbu bot haqida takliflaringiz va bot tayyorlash bo'yicha murojaatlar yuborishingiz mumkin.`,
      {
        reply_markup: keyboard,
      }
    );
  } else if (text === "🇺🇿 O'zbek so'mida") {
    const options = {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [backKeyboard],
      },
    };

    bot.sendMessage(
      msg.chat.id,
      "🇺🇿 O'zbek so'mida (UZS) qiymat kiriting.",
      options
    );
  } else if (!isNaN(parseFloat(text))) {
    const amountUZS = parseFloat(text);
    axios
      .get(CBUURL)
      .then((response) => {
        const currencyData = response.data;

        const usdCurrency = {
          Rate: 0.4,
        };

        const amountUZS = text;

        if (usdCurrency) {
          const usdRate = parseFloat(usdCurrency.Rate);
          const convertedUSD = (amountUZS / usdRate).toFixed(2);

          const eurRate = 0.37; // Exchange rate for EUR
          const convertedEUR = (amountUZS / eurRate).toFixed(2);

          const chfRate = 0.35; // Exchange rate for CHF
          const convertedCHF = (amountUZS / chfRate).toFixed(2);

          const rubRate = 35.67; // Exchange rate for RUB
          const convertedRUB = (amountUZS / rubRate).toFixed(2);

          const gbpRate = 0.32; // Exchange rate for GBP
          const convertedGBP = (amountUZS / gbpRate).toFixed(2);

          const jpyRate = 59.52; // Exchange rate for JPY
          const convertedJPY = (amountUZS / jpyRate).toFixed(2);

          const cnyRate = 2.9; // Exchange rate for CNY
          const convertedCNY = (amountUZS / cnyRate).toFixed(2);

          const kztRate = 181.75; // Exchange rate for KZT
          const convertedKZT = (amountUZS / kztRate).toFixed(2);

          const tryRate = 12.14; // Exchange rate for TRY
          const convertedTRY = (amountUZS / tryRate).toFixed(2);

          const replyText =
            `🇺🇸 AQSH dollari\n ${amountUZS} UZS = <b>${convertedUSD} USD</b>\n\n` +
            `🇪🇺 EVRO\n ${amountUZS} UZS = <b>${convertedEUR} EUR</b>\n\n` +
            `🇨🇭 Shveytsariya franki\n ${amountUZS} UZS =<b> ${convertedCHF} CHF</b>\n\n` +
            `🇷🇺 Rossiya rubli\n ${amountUZS} UZS = <b>${convertedRUB} RUB</b>\n\n` +
            `🇬🇧 Angliya funt sterlingi\n ${amountUZS} UZS = <b>${convertedGBP} GBP</b>\n\n` +
            `🇯🇵 Yaponiya iyenasi\n ${amountUZS} UZS = <b>${convertedJPY} JPY</b>\n\n` +
            `🇨🇳 Xitoy yuani\n ${amountUZS} UZS = <b>${convertedCNY} CNY</b>\n\n` +
            `🇰🇿 Qozog‘iston tengesi\n ${amountUZS} UZS = <b>${convertedKZT} KZT</b>\n\n` +
            `🇹🇷 Turkiya lirasi\n ${amountUZS} UZS = <b>${convertedTRY} TRY</b>\n\n` +
            `🕒 Sana: <b>${currencyData[0].Date}</b>\n\n` +
            `🤖 @dolorkursbot - Valyuta kurslari`;

          bot.sendMessage(msg.chat.id, replyText, {
            parse_mode: "HTML",
          });
        } else {
          bot.sendMessage(msg.chat.id, "AQSH dollari uchun kurs topilmadi.");
        }
      })
      .catch((error) => {
        console.log(error);
        bot.sendMessage(
          msg.chat.id,
          "Valyuta kurslarini olishda xatolik yuz berdi."
        );
      });
  } else if (text === "USD" || text === "EUR" || text === "RUB") {
    const currencyCode = text;

    axios
      .get(CBUURL)
      .then((response) => {
        const currencyData = response.data;
        const currency = currencyData.find((c) => c.Ccy === currencyCode);

        if (currency) {
          const replyText = `${currency.CcyNm_UZ} - ${currency.Rate} UZS`;
          bot.sendMessage(msg.chat.id, replyText);
        } else {
          bot.sendMessage(msg.chat.id, "Belirtilen para birimi bulunamadı.");
        }
      })
      .catch((error) => {
        console.log(error);
        bot.sendMessage(
          msg.chat.id,
          "Valyuta kurslarini olishda xatolik yuz berdi."
        );
      });
  } else if (text === "🔙 Orqaga") {
    const options = {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: menuKeyboard,
      },
    };
    bot.sendMessage(msg.chat.id, "Asosiy menyuga qaytdi.", options);
  }
});
