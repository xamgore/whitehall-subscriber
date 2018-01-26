import _ from 'lodash'
import l from '../log'
import Bot from 'telegraf'
import db from '../whitehall/database'
import whitehall from '../whitehall/broadcast'

const bot = new Bot(process.env.BOT_TOKEN)
const mk = Bot.Markup


let menu = {}

const mainMenu = ctx => (
  ctx.from.username === 'xamgore' && ctx.chat.type === 'private'
    ? menu.admin : menu.main)

const cmd = _.mapKeys({
  start: {
    text: '✔️ Подписаться на рассылку',
    async call(ctx) {
      const chatid = ctx.chat.id
      let res = await db.chat(chatid).get()

      if (res && res.is_active) {
        l.i('User is registered and active, nothing to do')
        return ctx.reply('✔️ Вы уже подписаны на рассылку', mainMenu(ctx))
      }

      await db.chat(chatid).saveInfo({ type: ctx.chat.type })
      l.i(res ? 'Chat was deactivated previously' : 'Chat is not registered')

      await ctx.reply('✅ Теперь вы будете получать рассылку', mainMenu(ctx))
        .then(() => l.i('Send a notification'))

      l.i('Send news')
      await whitehall.fetchAndSend(chatid)
    },
  },

  back: {
    text: '⬅️ Назад',
    async call(ctx) {
      ctx.reply('Ок', mainMenu(ctx))
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
      await db.chat(ctx.chat.id).markActive(false)

      l.i('Chat was unsubscribed')
      ctx.reply('Вы больше не будете получать рассылку', menu.start)
    },
  },

  chatid: {
    admin: true,
    text:  '❓Где я',
    call:  ctx =>
      // eslint-disable-next-line
      ctx.replyWithMarkdown('```\n' + JSON.stringify(ctx.message, null, 2) + '\n```'),
  },

  fetch: {
    text:  '📬 Фетч',
    admin: true,
    call:  ctx => whitehall.fetchAndSend(ctx.chat.id),
  },

  broadcast: {
    text:  '🎙 Бродкаст',
    admin: true,
    call:  whitehall.fetchAndBroadcast,
  },
}, (v, k) => { v.name = k; return k })


const mkKeyboard = cmds => ({
  reply_markup: mk.resize()
    .keyboard(cmds.map(c => mk.button(c.text)), { columns: 2 }),
})

menu = _.mapValues({
  start: [cmd.start],
  main:  [cmd.stop],
  admin: [cmd.chatid, cmd.fetch, cmd.broadcast, cmd.stop],
}, mkKeyboard)


// set bot's username for handling commands in groups
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})


// attach each menu action to the bot
_.values(cmd).forEach(c => bot.hears(c.text, (ctx) => {
  l.cmd(`/${c.name}`, l.user(ctx.from))
  db.log(ctx.from.id, ctx.chat.id, c.name)

  db.user({
    uid:  ctx.from.id,
    name: ctx.from.first_name,
    nick: ctx.from.username,
  }).saveInfo()

  if (!c.admin || ctx.from.username === 'xamgore')
    c.call(ctx)
}))


// called on the first user's interaction
bot.start(cmd.start.call)


// is called when "more results" button is pressed
bot.action('fetch news', cmd.fetch.call)


export default bot
