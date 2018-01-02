import Bot from 'telegraf'
import db from './database'

const bot = new Bot(process.env.BOT_TOKEN)

bot.start(async (ctx) => {
  console.log(`/start ${ctx.from.id}`)
  await db.subscribe(ctx.from.id, ctx.from.first_name, ctx.from.username)
  ctx.reply('You have been subscribed')
})

bot.command('stop', async (ctx) => {
  console.log(`/stop ${ctx.from.id}`)
  await db.unsubscribe(ctx.from.id)
  ctx.reply('Subscription was stopped')
})

export default { bot, client: new Bot.Telegram(process.env.BOT_TOKEN) }
