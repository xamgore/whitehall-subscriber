import db from '../../whitehall/database'
import l from '../../log'
import main from '../stages/main'

export default {
  name: 'stop',
  text: '⛔️ Отписаться',
  async call(ctx) {
    await db.chat(ctx.chat.id).markActive(false)

    l.i('Chat was unsubscribed')
    ctx.reply('Вы больше не будете получать рассылку', await main.menu(ctx))
    ctx.scene.enter('main')
  },
}
