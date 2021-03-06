import Bot from 'telegraf'
import Session from 'telegraf-session-local'
import Stage from 'telegraf/stage'

import main from './stages/main'
import channel from './stages/channel'
import feedback from './stages/feedback'

import start from './commands/start'
import fetch from './commands/fetch'
import mkMenuCmd from './menu-command'


// Create bot listener
const bot = new Bot(process.env.BOT_TOKEN)

// set bot's username for handling commands in groups
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})

// Create scene manager
const stage = new Stage([main.scene, channel.scene, feedback.scene])
bot.use((new Session({ storage: Session.storagefileSync })).middleware())
bot.use(stage.middleware())

// called on the first user's interaction
bot.start(start.call)

// is called when "more results" button is pressed
bot.action('fetch news', mkMenuCmd(fetch))


export default bot
