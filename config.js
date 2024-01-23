require("dotenv").config();

const { env } = process;

module.exports = {
  TOKEN: env.TOKEN,
  CBUURL: env.CBUURL,
};
