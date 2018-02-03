import l from '../log'
import mkMenuCommand from './menu-command'
import BaseScene from 'telegraf/scenes/base'
import SceneContext from 'telegraf/scenes/context'


BaseScene.prototype.commands = function (cmds) {
  cmds.forEach(c => this.hears(c.text, mkMenuCommand(c)))
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
