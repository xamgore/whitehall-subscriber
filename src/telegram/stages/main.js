import db from '../../whitehall/database'
import MenuScene from '../menu-scene'
import mkKeyboard from '../keyboard'
import _ from 'lodash'

import stop from '../commands/stop'
import chatid from '../commands/chatid'
import broadcast from '../commands/broadcast'
import channel from '../commands/channel'
import fetch from '../commands/fetch'
import settings from '../commands/settings'
import feedback from '../commands/feedback'
import subscribe from '../commands/subscribe'


const adminCmds = [chatid, channel, fetch, broadcast, settings]
const userCmds = [settings, feedback]

const isAdmin = ctx => ctx.from.username === 'xamgore' && ctx.chat.type === 'private'
const personalizedCmds = ctx => (isAdmin(ctx) ? adminCmds : userCmds)
const subscribeOrNot = async (ctx) => {
  let chat = await db.chat(ctx.chat.id).get()
  return chat.is_active ? stop : subscribe
}


const scene = new MenuScene('main')


scene.commands(_.unionBy([subscribe, stop], adminCmds, userCmds, cmd => cmd.name))


const menu = async ctx => mkKeyboard(_.concat(
  personalizedCmds(ctx), await subscribeOrNot(ctx)))


export default { scene, menu }
