import db from '../whitehall/database'
import l from '../log'

export default cmd => (ctx) => {
  l.cmd(`/${cmd.name}`, l.user(ctx.from))
  db.log(ctx.from.id, ctx.chat.id, cmd.name)

  db.user({
    uid:  ctx.from.id,
    name: ctx.from.first_name,
    nick: ctx.from.username,
  }).saveInfo()

  if (!cmd.admin || ctx.from.username === 'xamgore')
    cmd.call(ctx)
}
