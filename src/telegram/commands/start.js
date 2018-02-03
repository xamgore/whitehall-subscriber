import l from '../../log'
import db from '../../whitehall/database'
import whitehall from '../../whitehall/broadcast'
import main from '../stages/main'


export default {
  name: 'start',
  text: '✔️ Подписаться на рассылку',
  async call(ctx) {
    const chatid = ctx.chat.id
    let res = await db.chat(chatid).get()

    if (res && res.is_active) {
      l.i('User is registered and active, nothing to do')
      await ctx.reply('✔️ Вы уже подписаны на рассылку', main.menu(ctx))
      return ctx.scene.enter('main')
    }

    await db.chat(chatid).saveInfo({ type: ctx.chat.type })
    l.i(res ? 'Chat was deactivated previously' : 'Chat is not registered')

    l.i('Send a notification')
    await ctx.reply('✅ Теперь вы будете получать рассылку', main.menu(ctx))
    ctx.scene.enter('main')

    l.i('Send news')
    await whitehall.fetchAndSend(chatid)
  },
}
