import cron from 'cron'
import onExit from './exit'
import bot from './telegram/bot'
import db from './whitehall/database'
import whitehall from './whitehall/broadcast'


let job = null
onExit(() => job && job.stop())

db.create()
  .then(() => {
    job = new cron.CronJob('* * 21 * * *', whitehall.fetchAndBroadcast)
    job.start()
  })
  .then(() => bot.startPolling())
