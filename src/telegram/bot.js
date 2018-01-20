import l from '../log'
import Bot from 'telegraf'
import tm from '../telegram/client'
import db from '../whitehall/database'
import { stripIndent } from 'common-tags'
import whitehall from '../whitehall/broadcast'

const bot = new Bot(process.env.BOT_TOKEN)


// set bot's username for handling commands in groups
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})


bot.start(async (ctx) => {
  l.cmd('/start', l.user(ctx.from))

  const uid = ctx.from.id
  db.log(uid, 1)

  let res = await db.getUser(uid)
  let user = { uid, ...res, name: ctx.from.first_name, nick: ctx.from.username }

  if (res && user.is_active) {
    l.i('User is registered and active, nothing to do')
    ctx.reply('Вы уже подписаны на рассылку, всё ок')
    l.i('Update user info')
    return db.updateInfo(user)
  }

  if (!res) {
    l.w('User is not registered')
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


bot.command('chatid', (ctx) => {
  l.cmd('/chatid', l.user(ctx.from))
  if (ctx.from.username !== 'xamgore') return

  // eslint-disable-next-line
  ctx.replyWithMarkdown('```\n' + JSON.stringify(ctx.message, null, 2) + '\n```')
})


bot.command('admin', async (ctx) => {
  l.cmd('/admin', l.user(ctx.from))
  if (ctx.from.username !== 'xamgore') return

  const msg = await ctx.replyWithMarkdown(stripIndent`
    /chatid — get the chat's info
    /fetch — send news to the chat
    /broadcast — send news to everybody
  `)

  tm.deleteMessage(`${msg.chat.id}`, `${msg.message_id}`)
})


bot.command('broadcast', (ctx) => {
  l.cmd('/broadcast', l.user(ctx.from))
  if (ctx.from.username !== 'xamgore') return

  whitehall.fetchAndBroadcast()
})


const fetchNews = async (ctx) => {
  l.cmd('/fetch', l.user(ctx.from))

  const uid = ctx.from.id
  db.log(uid, 3)
  db.updateInfo({
    uid,
    is_active: ctx.chat.type === 'private',
    name:      ctx.from.first_name,
    nick:      ctx.from.username,
  })

  l.i('Send news')
  await whitehall.fetchAndSend(uid)
}


bot.action('fetch news', fetchNews)
bot.command('fetch', fetchNews)


bot.command('stop', async (ctx) => {
  l.cmd('/stop', l.user(ctx.from))

  const uid = ctx.from.id
  db.log(uid, 0)
  db.updateInfo({ uid, name: ctx.from.first_name, nick: ctx.from.username })

  await db.unsubscribe(uid)
  l.i('User is unsubscribed')
  ctx.reply('Вы больше не будете получать рассылку')
})


export default bot
