import l from '../log'
import Bot from 'telegraf'
import db from '../whitehall/database'
import whitehall from '../whitehall/broadcast'

const bot = new Bot(process.env.BOT_TOKEN)

// set bot's username for handling commands in groups
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})


bot.start(async (ctx) => {
  const uid = ctx.from.id

  console.log(`\n/start ${uid}`)
  db.log(uid, 1)

  let user = await db.getUser(uid)

  if (user && user.is_active)
    return l.i('User is registered and active, nothing to do') ||
      ctx.reply('Вы уже подписаны на рассылку, всё ок')

  if (!user) {
    l.w('User is not registered')
    user = { uid, name: ctx.from.first_name, nick: ctx.from.username }
    await db.subscribe(user)
  } else {
    l.i('User has sent "/stop" previously')
    db.markActive(uid)
  }

  await ctx.reply('Окей, теперь вы будете получать рассылку')
    .then(() => l.i('Send a notification'))

  l.i('Send news')
  await whitehall.fetchAndSend(uid)
})


bot.command('info', (ctx) => {
  console.log(`\n/chatid ${ctx.from.id}`)
  if (ctx.from.username !== 'xamgore') return

  // eslint-disable-next-line
  ctx.replyWithMarkdown('```\n' + JSON.stringify(ctx.message, null, 2) + '\n```')
})


bot.command('stop', async (ctx) => {
  const uid = ctx.from.id

  console.log(`\n/stop ${uid}`)
  db.log(uid, 0)

  await db.unsubscribe(uid)
  l.i('User is unsubscribed')
  ctx.reply('Вы больше не будете получать рассылку')
})


export default bot
