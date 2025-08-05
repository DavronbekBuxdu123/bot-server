const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const token = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(token, { polling: true });
const app = express();
function dava() {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        "Sammi.ac platformasida mavjud kurslarni sotib olishingiz mumkin.",
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "📚 Kurslarni ko‘rish",
                  web_app: {
                    url: "https://telegram-web-bot-two-psi.vercel.app/",
                  },
                },
              ],
            ],
            resize_keyboard: true,
          },
        }
      );
    }

    if (msg.web_app_data?.data) {
      try {
        const data = JSON.parse(msg.web_app_data.data);
        const total = data.reduce((acc, c) => acc + c.quantity * c.price, 0);
        const formattedPrice = total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });

        await bot.sendMessage(
          chatId,
          "✅ Bizga ishonch bildirganingiz uchun raxmat!\n🛒 Sotib olingan kurslaringiz:"
        );
        for (const item of data) {
          await bot.sendPhoto(chatId, item.Image);
          await bot.sendMessage(chatId, `📘 ${item.title} — ${item.quantity}x`);
        }
        await bot.sendMessage(chatId, `💰 Umumiy narx: ${formattedPrice}`);
        await bot.sendMessage(chatId, "To‘lov turini tanlang:", {
          reply_markup: {
            keyboard: [
              [{ text: "💳 Click / Payme orqali to‘lov" }],
              [{ text: "💵 Naqd to‘lov" }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
      } catch (error) {
        await bot.sendMessage(
          chatId,
          "Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring."
        );
      }
    }

    if (text === "💳 Click / Payme orqali to‘lov") {
      await bot.sendMessage(
        chatId,
        "💳 Iltimos, karta raqamingizni yuboring (faqat 16 xonali raqam):"
      );
    }
    if (/^\d{16}$/.test(text)) {
      await bot.sendMessage(
        chatId,
        "✅ Karta raqamingiz qabul qilindi. Tez orada admin siz bilan bog‘lanadi."
      );
    }
    if (/^\d{10,19}$/.test(text)) {
      await bot.sendMessage(
        chatId,
        "❌ Iltimos, aynan 16 xonali raqam kiriting."
      );
    }

    if (text === "💵 Naqd to‘lov") {
      await bot.sendMessage(
        chatId,
        `📞 Tez orada admin siz bilan bog‘lanadi.\n🔗 Username: @${
          msg.from.username || "yo‘q"
        }`
      );
    }

    if (/^\d{16}$/.test(text)) {
      await bot.sendMessage(
        chatId,
        "✅ Karta raqamingiz qabul qilindi. Tez orada admin siz bilan bog‘lanadi."
      );
    }
  });
}

dava();

app.get("/", (req, res) => {
  res.send("bot ishga tushdi!");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
