import cron from 'cron'
import onExit from './exit'
import db from './database'
import tm from './telegram'
import fetchEvents from './whitehall'

const url = page => process.env.LINK.replace('{}', encodeURI(page))

let send = async (user, events) => {
  let count = 0

  for (let e of events) {
    const read = await db.hasRead(user, e.link)

    if (!read.length) {
      const msg = `[${e.title}](${url(e.link)})`

      await tm.client.sendMessage(user, msg, { parse_mode: 'Markdown' })
      await db.markRead(user, e.link)

      // not more than 4 posts per day, experimental value
      if (++count >= 4) return
    }
  }
}

let broadcast = async () => {
  console.log('cron job!')
  let users = await db.getUsers()
  let events = await fetchEvents()
  console.log(`${users.length} users, ${events.length} events`)
  return Promise.all(users.map(u => send(u.uid, events)))
}

let job = null
onExit(() => job && job.stop())

db.create()
  .then(() => {
    job = new cron.CronJob('10 * * * * *', broadcast)
    job.start()
  })
  .then(() => tm.bot.startPolling())
