import l from '../log'
import Bot from 'telegraf'
import db from '../whitehall/database'
import whitehall from '../whitehall/broadcast'

const bot = new Bot(process.env.BOT_TOKEN)
const mk = Bot.Markup


// set bot's username for handling commands in groups
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})


bot.start(async (ctx) => {
  l.cmd('/start', l.user(ctx.from))

  const uid = ctx.from.id
  db.log(uid, 1)

  let user = await db.getUser(uid)

  if (user && user.is_active)
    return l.i('User is registered and active, nothing to do') ||
      ctx.reply('Вы уже подписаны на рассылку, всё ок')

  if (!user) {
    l.w('User is not registered')
    user = { uid, name: ctx.from.first_name, nick: ctx.from.username }
    await db.register(user)
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
  l.cmd('/chatid', l.user(ctx.from))
  if (ctx.from.username !== 'xamgore') return

  // eslint-disable-next-line
  ctx.replyWithMarkdown('```\n' + JSON.stringify(ctx.message, null, 2) + '\n```')
})


bot.command('broadcast', (ctx) => {
  l.cmd('/broadcast', l.user(ctx.from))
  if (ctx.from.username !== 'xamgore') return

  whitehall.fetchAndBroadcast()
})


bot.action('fetch news', async (ctx) => {
  l.cmd('/more news', l.user(ctx.from))

  const uid = ctx.from.id
  db.log(uid, 3)

  l.i('Send news')
  await whitehall.fetchAndSend(uid)
})


bot.command('stop', async (ctx) => {
  l.cmd('/stop', l.user(ctx.from))

  const uid = ctx.from.id
  db.log(uid, 0)

  await db.unsubscribe(uid)
  l.i('User is unsubscribed')
  ctx.reply('Вы больше не будете получать рассылку')
})


export default bot
