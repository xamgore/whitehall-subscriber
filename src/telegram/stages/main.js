import MenuScene from '../menu-scene'
import mkKeyboard from '../keyboard'

import stop from '../commands/stop'
import chatid from '../commands/chatid'
import broadcast from '../commands/broadcast'
import channel from '../commands/channel'
import fetch from '../commands/fetch'
import settings from '../commands/settings'


const cmds = [chatid, channel, fetch, broadcast, settings, stop]

const scene = new MenuScene('main')


scene.commands(cmds)

scene.command('lol', ctx => ctx.reply('lol'))

const isAdmin = ctx => ctx.from.username === 'xamgore' && ctx.chat.type === 'private'

const menu = ctx => mkKeyboard(isAdmin(ctx) ? cmds : [settings, stop])


export default { scene, menu }
