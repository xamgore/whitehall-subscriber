import Bot from 'telegraf'
import db from './database'

const bot = new Bot(process.env.BOT_TOKEN)

bot.start((ctx) => {
  console.log(`/start ${ctx.from.id}`)
  db.subscribe(ctx.from.id, ctx.from.first_name, ctx.from.username)
    .then(ctx.reply('You have been subscribed'))
})

bot.hears('chat id', (ctx) => {
  console.log(`/chatid ${ctx.from.id}`)
  console.log(JSON.stringify(ctx.message))
  // eslint-disable-next-line
  ctx.replyWithMarkdown('```\n' + JSON.stringify(ctx.message, null, 2) + '\n```')
})

bot.command('stop', (ctx) => {
  console.log(`/stop ${ctx.from.id}`)
  db.unsubscribe(ctx.from.id)
    .then(ctx.reply('Subscription was stopped'))
})

export default { bot, client: new Bot.Telegram(process.env.BOT_TOKEN) }
