import db from '../../whitehall/database'
import guest from '../stages/guest'
import l from '../../log'

export default {
  name: 'stop',
  text: '⛔️ Отписаться',
  async call(ctx) {
    await db.chat(ctx.chat.id).markActive(false)

    l.i('Chat was unsubscribed')
    ctx.reply('Вы больше не будете получать рассылку', guest.menu(ctx))
    ctx.scene.enter('guest')
  },
}
