import Bot from 'telegraf'

const client = new Bot.Telegram(process.env.BOT_TOKEN)

client.sendMessage(process.env.DEV_CHAT, '🤖 Включился', {
  disable_notification: true,
})

export default client
