import MenuScene from '../menu-scene'
import l from '../../log'
import main from '../stages/main'
import mkKeyboard from '../keyboard'
import feedback from '../commands/feedback'
import back from '../commands/back'
import tm from '../client'


const scene = new MenuScene('feedback')

const menu = () => mkKeyboard([back()])


scene.enter(async (ctx) => {
  await ctx.reply('Если у вас есть идеи для развития бота, или вы ' +
    'наткнулись на ошибку, можете написать о них здесь. ' +
    'Изображения и стикеры пока что не поддерживаются.', menu())
})

scene.leave(ctx => ctx.reply('Спасибо за внимание', main.menu(ctx)))

scene.commands([feedback, back(ctx => ctx.scene.enter('main'))])

scene.on('message', async (ctx) => {
  l.i('Send the message')
  const msg = `Username: ${ctx.from.username}\n`
    + `First name: ${ctx.from.first_name}\n`
    + `chatid: ${ctx.chat.id}\n\n${ctx.message.text}`

  await tm.sendMessage(process.env.DEV_CHAT, msg)
  l.i('Completed')
})


export default { scene, menu }
