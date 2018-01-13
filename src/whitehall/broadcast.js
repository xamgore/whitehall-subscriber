import l from '../log'
import __ from 'aigle'
import lodash from 'lodash'
import db from './database'
import tm from '../telegram/client'
import fetchEvents from './scrapper'
import Bot from 'telegraf'


__.mixin(lodash)

const mk = Bot.Markup

const url = page => process.env.LINK.replace('{}', encodeURI(page))


let send = async (user, events) => {
  __
    .chain(events)
    .reject(e => db.hasRead(user, e.link).then(r => r.length))
    .take(3) // posts per day
    .each(async (e, i, total) => {
      const msg = `[${e.title}](${url(e.link)})`
      const notLast = i !== total.length - 1

      await tm.sendMessage(user, msg, {
        parse_mode:   'Markdown',
        reply_markup: mk.inlineKeyboard([
          mk.callbackButton('Загрузить ещё концерты', 'fetch news', notLast),
        ]),
      })

      db.markRead(user, e.link)
      await __.delay(1000)
    })
}


let fetchAndSend = async (uid) => {
  l.i('Fetch news')
  let events = await fetchEvents()
  return send(uid, events)
}


let fetchAndBroadcast = async () => {
  let users = await db.getActiveUsers()
  l.i(`Users: ${users.length}`)
  let events = await fetchEvents()
  l.i(`Events: ${events.length}`)

  await Promise.all(users.map(u => send(u.uid, events)))
  l.i('Broadcast finished')
}


export default { send, fetchAndSend, fetchAndBroadcast }
