import { Markup } from 'telegraf'

export default cmds => ({
  reply_markup: Markup.resize()
    .keyboard(cmds.map(c => Markup.button(c.text)), { columns: 2 }),
})
