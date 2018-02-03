import sqlite from 'sqlite3-wrapper'
import onExit from '../exit'
import promisify from 'es6-promisify'
import l from '../log'


const util = { promisify }
const db = sqlite.open('./db.sqlite')

// close db connection in case of sudden errors
onExit(() => db.close())

// promisify functions for use in an async way
const insert = util.promisify(db.insert)
const select = util.promisify(db.select)
const update = util.promisify(db.update)
const run = util.promisify(db.database().run.bind(db.database()))


const logTypes = {
  stop:      0,
  start:     1,
  chatid:    2,
  fetch:     3,
  broadcast: 4,
  settings:  5,
}


export default {
  log: (uid, chatid, cmd) => insert('log', { uid, chatid, type: logTypes[cmd] || -1 }),

  event: url => ({
    // whether the event has been shown to the chat before
    wasReadBy: chatid =>
      select({ table: 'journal', where: { chatid, url } })
        .then(r => r.length > 0),

    // mark the event as read, so it will not be shown the next time
    add: chatid => insert('journal', { chatid, url }),
  }),

  chat: id => ({
    // returns the chat's object if exists, else null
    get: () => select({ table: 'chats', where: { id } }).then(r => r.concat(null)[0]),

    // the chat will receive new events
    markActive: active => update('chats', { id }, { is_active: active }),

    saveInfo: ({ type }) => // TODO title, description, invite_link
      l.i('Update chat info') || run('INSERT OR REPLACE INTO chats(\
        id, is_active, type) VALUES ((?), 1, (?))',
        [id, type]),
  }),

  user: u => ({
    saveInfo: () =>
      l.i('Update user info') || run('INSERT OR REPLACE INTO users(\
        uid, name, nick) VALUES ((?), (?), (?))',
        [u.uid, u.name, u.nick]),
  }),

  chats: {
    getActive: () => select({ table: 'chats', where: { is_active: true } }),
    getAll:    () => select({ table: 'chats' }),
  },

  async create() {
    const queries = [
      'CREATE TABLE IF NOT EXISTS users (uid  INT PRIMARY KEY, name TEXT, nick TEXT)',
      'CREATE TABLE IF NOT EXISTS journal(date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, uid INT NOT NULL, event TEXT NOT NULL, UNIQUE (uid, event))',
      'CREATE TABLE IF NOT EXISTS log(date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, uid INT NOT NULL, chat INT NOT NULL, type INT NOT NULL)',
      'CREATE TABLE IF NOT EXISTS chats(id INT PRIMARY KEY, is_active INT DEFAULT 1 NOT NULL, type TEXT NOT NULL, title TEXT, description TEXT, invite_link TEXT)',
    ]

    await Promise.all(queries.map(q => run(q)))
  },
}
