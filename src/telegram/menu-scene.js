import db from '../whitehall/database'
import l from '../log'
import BaseScene from 'telegraf/scenes/base'
import SceneContext from 'telegraf/scenes/context'


const listen = cmd => (ctx) => {
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

BaseScene.prototype.commands = function (cmds) {
  cmds.forEach(c => this.hears(c.text, listen(c)))
  return this
}


const { enter, leave } = SceneContext.prototype

SceneContext.prototype.enter = function (sceneId, ...args) {
  l.i(`Enter the "${sceneId}" scene`)
  return enter.call(this, sceneId, ...args)
}

SceneContext.prototype.leave = function () {
  this.current
    ? l.i(`Leave the "${this.current.id}" scene`)
    : l.i('This is the first scene')
  return leave.call(this)
}


export default BaseScene
