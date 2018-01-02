import cron from 'cron'
import db from './database'
import tm from './telegram'
import fetchEvents from './whitehall'

const url = page => process.env.LINK.replace('{}', encodeURI(page))

let send = async (user, events) => {
  for (let e of events) {
    const read = await db.hasRead(user, e.link)

    if (!read.length) {
      const msg = `[${e.title}](${url(e.link)})`
      await tm.client.sendMessage(user, msg, { parse_mode: 'Markdown' })
        .then(() => db.markRead(user, e.link))
    }
  }
}


let broadcast = async events =>
  Promise.all((await db.getUsers()).map(u => send(u.uid, events)))

let fetchAndBroadcast = () => {
  console.log('cron job!')
  fetchEvents().then(events => broadcast(events))
}

db.create()
  .then(() => new cron.CronJob('15 * * * * *', fetchAndBroadcast).start())
  .then(() => tm.bot.startPolling())
