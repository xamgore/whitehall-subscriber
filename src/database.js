import sqlite from 'sqlite3-wrapper'
import cleanup from 'node-cleanup'
import util from 'util'


const db = sqlite.open('./db.sqlite')

// close db connection in case of sudden errors
cleanup((exitCode, signal) => {
  db.close()

  process.kill(process.pid, signal)
  cleanup.uninstall()
  return false
})

// promisify functions for use in an async way
const insert = util.promisify(db.insert)
const select = util.promisify(db.select)
const remove = util.promisify(db.delete)
const run = util.promisify(db.database().run.bind(db.database()))


export default {
  hasRead:  (uid, event) => select({ table: 'journal', where: { uid, event } }),
  markRead: (uid, event) => insert('journal', { uid, event }),

  unsubscribe: uid => remove('active', { uid }),
  subscribe:   (uid, name, nick) => insert('active', { uid, name, nick }),
  getUsers:    () => select('SELECT * FROM active'),

  async create() {
    await run('CREATE TABLE IF NOT EXISTS journal(uid INT, event TEXT, UNIQUE (uid, event))')
    await run('CREATE TABLE IF NOT EXISTS active(uid INT PRIMARY KEY, name TEXT, nick TEXT)')
  },
}
