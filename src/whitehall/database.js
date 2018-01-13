import sqlite from 'sqlite3-wrapper'
import onExit from '../exit'
import promisify from 'es6-promisify'


const util = { promisify }
const db = sqlite.open('./db.sqlite')

// close db connection in case of sudden errors
onExit(() => db.close())

// promisify functions for use in an async way
const insert = util.promisify(db.insert)
const select = util.promisify(db.select)
const update = util.promisify(db.update)
const run = util.promisify(db.database().run.bind(db.database()))


export default {
  log: (uid, type) => insert('log', { uid, type }),

  hasRead:  (uid, event) => select({ table: 'journal', where: { uid, event } }),
  markRead: (uid, event) => insert('journal', { uid, event }),

  markActive:  uid => update('users', { uid }, { is_active: true }),
  unsubscribe: uid => update('users', { uid }, { is_active: false }),
  updateInfo:  u => update('users', { uid: u.uid }, u),
  register:    (u) => {
    u.is_active = true
    return run('INSERT OR REPLACE INTO users(\
      uid, is_active, name, nick) VALUES ((?), (?), (?), (?))',
      [u.uid, u.is_active, u.name, u.nick])
  },

  getActiveUsers: () => select({ table: 'users', where: { is_active: true } }),
  getUser:        uid => select({ table: 'users', where: { uid } })
    .then(r => r.concat(null)[0]),

  async create() {
    const queries = [
      'CREATE TABLE IF NOT EXISTS users(uid INT PRIMARY KEY, is_active INT NOT NULL DEFAULT 1, name TEXT, nick TEXT)',
      'CREATE TABLE IF NOT EXISTS journal(uid INT NOT NULL, event TEXT NOT NULL, UNIQUE (uid, event))',
      'CREATE TABLE IF NOT EXISTS log(date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, uid INT NOT NULL, type INT NOT NULL)',
    ]

    await Promise.all(queries.map(q => run(q)))
  },
}
