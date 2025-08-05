const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const token = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(token, { polling: true });
const app = express();

const userStates = new Map();

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    userStates.set(chatId, null);
    await bot.sendMessage(
      chatId,
      "Sammi.ac platformasida mavjud kurslarni sotib olishingiz mumkin.",
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "📚 Kurslarni ko'rish",
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
      const fullName = `${msg.from.first_name || ""} ${
        msg.from.last_name || ""
      }`.trim();
      const userName = msg.from.username ? `(@${msg.from.username})` : "";
      await bot.sendMessage(
        chatId,
        `✅ ${fullName} ${userName}, bizga ishonch bildirganingiz uchun raxmat!\n🛒 Sotib olingan kurslaringiz:`
      );
      for (const item of data) {
        await bot.sendPhoto(chatId, item.Image);
        await bot.sendMessage(chatId, `📘 ${item.title} — ${item.quantity}x`);
      }
      await bot.sendMessage(chatId, `💰 Umumiy narx: ${formattedPrice}`);
      await bot.sendMessage(chatId, "To'lov turini tanlang:", {
        reply_markup: {
          keyboard: [
            [{ text: "💳 Plastik orqali to'lov" }],
            [{ text: "💵 Naqd to'lov" }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });

      userStates.set(chatId, "waiting_for_payment_type");
    } catch (error) {
      await bot.sendMessage(
        chatId,
        "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
      );
    }
  }
  if (text === "💳 Plastik orqali to'lov") {
    userStates.set(chatId, "card_number");
    await bot.sendMessage(
      chatId,
      "💳 Iltimos, karta raqamingizni yuboring (faqat 16 xonali raqam):"
    );
    return;
  }

  if (text === "💵 Naqd to'lov") {
    userStates.set(chatId, null);
    await bot.sendMessage(
      chatId,
      `Hurmatli ${msg.from.first_name} tez orada admin siz bilan bog'lanadi.\n 📞Admin: @Aslonov_Davronbek
      `
    );
    return;
  }

  if (userStates.get(chatId) === "card_number") {
    if (/^\d{16}$/.test(text)) {
      await bot.sendMessage(
        chatId,
        `Hurmatli ${msg.from.first_name} tez orada admin siz bilan bog'lanadi.\n 📞Admin: @Aslonov_Davronbek
      `
      );
      userStates.set(chatId, null);
    } else {
      await bot.sendMessage(
        chatId,
        "❌ Iltimos, faqat 16 xonali raqam kiriting."
      );
    }
  }
});

app.get("/", (req, res) => {
  res.send("bot ishga tushdi!");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
