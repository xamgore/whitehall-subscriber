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


let send = async (chatid, events) => {
  __
    .chain(events)
    .reject(e => db.event(e.link).wasReadBy(chatid))
    .take(3) // posts per day
    .each(async (e, i, total) => {
      await __.delay(1000 * i)

      const msg = `[${e.title}](${url(e.link)})`
      const notLast = i !== total.length - 1

      await tm.sendMessage(chatid, msg, {
        parse_mode:   'Markdown',
        reply_markup: mk.inlineKeyboard([
          mk.callbackButton('Загрузить ещё концерты', 'fetch news', notLast),
        ]),
      })

      db.event(e.link).add(chatid)
    })
}


let fetchAndSend = async chatid => send(chatid, await fetchEvents())


let fetchAndBroadcast = async () => {
  let chats = await db.getActiveChats()
  l.w(`Active chats: ${chats.length}`)
  let events = await fetchEvents()
  l.w(`Events: ${events.length}`)

  await Promise.all(chats.map(ch => send(ch.id, events)))
  l.i('Broadcast finished')
}


export default { send, fetchAndSend, fetchAndBroadcast }
