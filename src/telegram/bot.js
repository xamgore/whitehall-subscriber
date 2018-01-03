import Bot from 'telegraf'
import db from '../whitehall/database'
import whitehall from '../whitehall/broadcast'

const bot = new Bot(process.env.BOT_TOKEN)


bot.start((ctx) => {
  const uid = ctx.from.id
  console.log(`/start ${uid}`)

  db.subscribe(uid, ctx.from.first_name, ctx.from.username)
    .then(() => db.log(uid, 1))
    .then(() => ctx.reply('You have been subscribed'))
    .then(() => whitehall.fetchAndSend(uid))
    .catch(err => console.error(err))
})


bot.hears('chat id', (ctx) => {
  console.log(`/chatid ${ctx.from.id}`)
  if (ctx.from.nickname !== 'xamgore') return

  // eslint-disable-next-line
  ctx.replyWithMarkdown('```\n' + JSON.stringify(ctx.message, null, 2) + '\n```')
})


bot.command('stop', (ctx) => {
  const uid = ctx.from.id
  console.log(`/stop ${uid}`)

  db.unsubscribe(uid)
    .then(() => db.log(uid, 0))
    .then(() => ctx.reply('Subscription was stopped'))
})


export default bot
