import MenuScene from '../menu-scene'
import db from '../../whitehall/database'
import l from '../../log'
import main from '../stages/main'
import mkKeyboard from '../keyboard'
import back from '../commands/back'
import tm from '../client'


const scene = new MenuScene('channel')

const menu = () => mkKeyboard([back()])


let chats = [] // fixme: not for two admins

scene.enter(async (ctx) => {
  await ctx.reply('Всё что ты мне сейчас перешлёшь, будет отправлено всем, кто подписан на бота', menu())

  chats = await db.chats.getAll()
  await ctx.reply(`Всего доступно чатов ${chats.length}`)
  l.i(`Chats: ${chats.length}`)
})

scene.leave((ctx) => {
  ctx.reply('Режим выключен', main.menu(ctx))
})

scene.commands([back(ctx => ctx.scene.enter('main'))])

scene.on('message', async (ctx) => {
  let count = chats.length

  const msg = ctx.message.text
  const send = chat =>
    tm.sendMessage(chat.id, msg, { parse_mode: 'Markdown' })
      .catch((e) => { --count; l.e(e) }) // todo: update chat info

  l.i('Send the message')
  await Promise.all(chats.map(send))
  l.i('Completed')
  ctx.reply(`Доставлено в ${count} / ${chats.length} чатов`)
})


export default { scene, menu }
