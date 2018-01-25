import _ from 'lodash'
import l from '../log'
import Bot from 'telegraf'
import db from '../whitehall/database'
import whitehall from '../whitehall/broadcast'

const bot = new Bot(process.env.BOT_TOKEN)
const mk = Bot.Markup


let menu = {}

const cmd = _.mapKeys({
  start: {
    text: '✔️ Подписаться на рассылку',
    async call(ctx) {
      const uid = ctx.from.id
      db.log(uid, 'start')

      let res = await db.getUser(uid)
      let user = { uid, ...res, name: ctx.from.first_name, nick: ctx.from.username }

      if (res && user.is_active) {
        l.i('User is registered and active, nothing to do')
        ctx.reply('✅ Вы уже подписаны на рассылку', menu.main)
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

      await ctx.reply('✅ Теперь вы будете получать рассылку', menu.main)
        .then(() => l.i('Send a notification'))

      l.i('Send news')
      await whitehall.fetchAndSend(uid)
    },
  },

  back: {
    text: '⬅️ Назад',
    async call(ctx) {
      ctx.reply('Ок', menu.main)
    },
  },

  settings: {
    text: '⚙️ Настройки',
    async call(ctx) {
      ctx.reply('😬 Здесь пока ничего нет')
    },
  },

  stop: {
    text: '⛔️ Отписаться',
    async call(ctx) {
      const uid = ctx.from.id
      db.log(uid, 'stop')
      db.updateInfo({ uid, name: ctx.from.first_name, nick: ctx.from.username })

      await db.unsubscribe(uid)
      l.i('User is unsubscribed')
      ctx.reply('Вы больше не будете получать рассылку', menu.start)
    },
  },

  chatid: {
    admin: true,
    text:  '❓Где я',
    async call(ctx) {
      // eslint-disable-next-line
      ctx.replyWithMarkdown('```\n' + JSON.stringify(ctx.message, null, 2) + '\n```')
    },
  },

  fetch: {
    text:  '📬 Фетч',
    admin: true,
    async call(ctx) {
      const uid = ctx.from.id
      db.log(uid, 'fetch')
      db.updateInfo({
        uid,
        is_active: ctx.chat.type === 'private',
        name:      ctx.from.first_name,
        nick:      ctx.from.username,
      })

      l.i('Send news')
      await whitehall.fetchAndSend(uid, menu.main)
    },
  },

  broadcast: {
    text:  '🎙 Бродкаст',
    admin: true,
    call:  whitehall.fetchAndBroadcast,
  },
}, (v, k) => { v.name = k; return k })


const mkKeyboard = cmds => ({
  reply_markup: mk.oneTime().resize().keyboard(cmds.map(c => mk.button(c.text))),
})

menu = _.mapValues({
  start: [cmd.start],
  main:  [cmd.settings, cmd.stop],
  admin: [cmd.chatid, cmd.fetch, cmd.broadcast, cmd.back],
}, mkKeyboard)


// set bot's username for handling commands in groups
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})


// attach each menu action to bot
_.values(cmd).forEach(c => bot.hears(c.text, (ctx) => {
  if ('admin' in c && c.admin === true && ctx.from.username !== 'xamgore')
    return

  l.cmd(`/${c.name}`, l.user(ctx.from))
  c.call(ctx)
}))


// called on the first user's interaction
bot.start(cmd.start.call)


// a hidden commands for admin
bot.command('admin', async (ctx) => {
  l.cmd('/admin', l.user(ctx.from))
  ctx.from.username === 'xamgore'
    ? ctx.reply('👋🏻 о, админ', menu.admin)
    : ctx.reply('🖕🏻сюда нельзя')
})


// is called when "more results" button is pressed
bot.action('fetch news', cmd.fetch.call)


export default bot
