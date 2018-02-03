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


const adminCmds = [chatid, channel, fetch, broadcast, settings, stop]
const userCmds = [settings, stop, feedback]

const scene = new MenuScene('main')


scene.commands(_.unionBy(adminCmds, userCmds, cmd => cmd.name))

scene.command('lol', ctx => ctx.reply('lol'))

const isAdmin = ctx => ctx.from.username === 'xamgore' && ctx.chat.type === 'private'

const menu = ctx => mkKeyboard(isAdmin(ctx) ? adminCmds : userCmds)


export default { scene, menu }
