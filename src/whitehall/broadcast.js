import db from './database'
import tm from '../telegram/client'
import fetchEvents from './scrapper'


const url = page => process.env.LINK.replace('{}', encodeURI(page))

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))


let send = async (user, events) => {
  let count = 0

  for (let e of events) {
    const read = await db.hasRead(user, e.link)

    if (!read.length) {
      const msg = `[${e.title}](${url(e.link)})`

      await tm.sendMessage(user, msg, { parse_mode: 'Markdown' })
      await db.markRead(user, e.link)
      await sleep(2000)

      // not more than 4 posts per day, experimental value
      if (++count >= 4) return
    }
  }
}


let fetchAndSend = async (uid) => {
  let events = await fetchEvents()
  return send(uid, events)
}


let fetchAndBroadcast = async () => {
  console.log('broadcast!')
  let users = await db.getUsers()
  let events = await fetchEvents()
  console.log(`${users.length} users, ${events.length} events`)
  return Promise.all(users.map(u => send(u.uid, events)))
}


export default { send, fetchAndSend, fetchAndBroadcast }
