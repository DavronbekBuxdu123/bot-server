const TelegramBot = require("node-telegram-bot-api");
const token = "8287088287:AAHmArs02eKsPAebcHS20fk12quFMqhwm_Q";
const bot = new TelegramBot(token, { polling: true });

const dava = () => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        "Sammi.ac platformasida bor kurslarni sotib olishingiz mumkin",
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Kurslarni ko'rish",
                  web_app: {
                    url: "https://telegram-web-bot-two-psi.vercel.app/",
                  },
                },
              ],
            ],
          },
        }
      );
    }
    if (msg.web_app_data?.data) {
      const hisobla = () => {
        const data = JSON.parse(msg.web_app_data?.data);
        const sum = data.reduce((acc, c) => acc + c.quantity * c.price, 0);
        return sum.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      };

      try {
        const data = JSON.parse(msg.web_app_data?.data);
        await bot.sendMessage(
          chatId,
          "Bizga ishonch bildirganingiz uchun raxmat, sotib olgan kurslaringiz ro'yxati"
        );

        for (item of data) {
          await bot.sendPhoto(chatId, item.Image);
          await bot.sendMessage(chatId, `${item.title} ${item.quantity}x`);
        }
        await bot.sendMessage(chatId, `Umumiy narx ${hisobla()}`);
      } catch (error) {
        console.log(error);
      }
    }
  });
};
dava();
