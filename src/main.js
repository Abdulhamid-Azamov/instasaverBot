import { Telegraf } from "telegraf";
import { exec } from "child_process"
import { config } from "dotenv";
import fs from 'fs'
config()

const TOKEN = process.env.BOT_TOKEN
const telegraf = new Telegraf(TOKEN)


const Menu = {
    reply_markup: {
        keyboard: [
            ["Instagram Video yuklash 📥"],
            ["Yordam ℹ️", "Bot haqida 👤"],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
    }
}

telegraf.telegram.setMyCommands([
    { command: "start", description: "Botni ishga tushirish" },
    { command: "help", description: "Yordam" },
    { command: "about", description: "Bot haqida" },
    { command: "menu", description: "Asosiy menyu" },
    { command: "ping", description: "Bot holatini tekshirish" },
]);


telegraf.start((ctx) => {
    ctx.reply(
        "Assalomu alaykum xush kelibsiz😊\nInstagramdan video yokida Reels linkini yuboring💭"
    )
    console.log(ctx.from.first_name);
})

telegraf.command("help", (ctx) => {
    ctx.reply(
        "Foydalanish yo‘riqnomasi:\n\n" +
        "1️⃣ Instagram video yoki Reels linkini yuboring\n" +
        "2️⃣ Private akkaunt videolari yuklanmaydi\n" +
        "3️⃣ Faqat instagram.com link qabul qilinadi"
    );
});

telegraf.command("about", (ctx) => {
    ctx.reply(
        " Instagram Video Saver Bot🤖\n" +
        "Tez va sifatli yuklab berish⚡\n" +
        "Developer: @navoyamisaverbot👨‍💻"
    );
});

telegraf.command("menu", (ctx) => {
    ctx.reply("Asosiy menyu 👇", Menu);
});

telegraf.command("ping", (ctx) => {
    ctx.reply("Bot ishlayapti!✅");
});




telegraf.hears("Instagram Video yuklash 📥", (ctx) => {
        ctx.reply("Instagram video yoki Reels linkini yuboring 📎")
})
telegraf.hears("Yordam ℹ️", (ctx) => {
    ctx.reply(
        "Instagram video yoki Reels linkini yuboring 📌.\n" +
        "Private akkaunt videolari yuklanmaydi 📌"
    )
})
telegraf.hears("Bot haqida 👤", (ctx) => {
    ctx.reply(
        "Instagram Video Saver Bot 🤖\n" +
        "Tez va sifatli yuklab berish ⚡"
    )
})




telegraf.on("text", async (ctx) => {
    const text = ctx.message.text

    if (text.endsWith("📥")||text.endsWith("ℹ️")||text.endsWith("👤")) {
        return;
    }

    if (!text.includes('instagram.com')) {
        return ctx.reply("Iltimos faqat instagram link yuboring yokida quyidagilardan birini tanlang‼️")
    };

    const loadMessage = await ctx.reply("Video olinmoqda...📤")

    const fileName = `video_${Date.now()}.mp4`

    exec(`yt-dlp -f mp4 -o ${fileName} ${text}`, async (err) => {
        await ctx.deleteMessage(loadMessage.message_id)

        if (err) {
            ctx.reply("Video olinmadi⛔")
            return;
        }
        await ctx.replyWithVideo({ source: fs.createReadStream(fileName) }, {
            caption: "Instagramdan yuklab olindi🎥\n By: @navoyamisaverbot"
        })
        fs.unlinkSync(fileName)
    })

})

telegraf.launch()
console.log('Instagram botimiz ishga tushdi😁');




process.once('SIGINT', () => telegraf.stop('SIGINT'))
process.once('SIGTERM', () => telegraf.stop('SIGTERM'))