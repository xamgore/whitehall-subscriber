import l from '../log'
import db from './database'
import tm from '../telegram/client'
import fetchEvents from './scrapper'
import Bot from 'telegraf'

const mk = Bot.Markup


const url = page => process.env.LINK.replace('{}', encodeURI(page))

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))


let send = async (user, events) => {
  let count = 1

  for (let e of events) {
    const read = await db.hasRead(user, e.link)
    if (read.length) continue

    const msg = `[${e.title}](${url(e.link)})`

    await tm.sendMessage(user, msg, {
      parse_mode:   'Markdown',
      reply_markup: mk.inlineKeyboard([
        mk.callbackButton('Загрузить ещё концерты', 'fetch news', count !== 4),
      ]),
    })

    await db.markRead(user, e.link)
    await sleep(2000)

    // not more than 4 posts per day
    if (count++ >= 4) return
  }
}


let fetchAndSend = async (uid) => {
  l.i('Fetch news')
  let events = await fetchEvents()
  return send(uid, events)
}


let fetchAndBroadcast = async () => {
  console.log('broadcast!')
  let users = await db.getActiveUsers()
  let events = await fetchEvents()
  console.log(`${users.length} users, ${events.length} events`)
  return Promise.all(users.map(u => send(u.uid, events)))
}


export default { send, fetchAndSend, fetchAndBroadcast }
