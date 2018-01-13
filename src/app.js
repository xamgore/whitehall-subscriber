import cron from 'cron'
import onExit from './exit'
import bot from './telegram/bot'
import db from './whitehall/database'
import whitehall from './whitehall/broadcast'
import log from './log'


db.create()
  .then(() => {
    let jobs = [
      // new cron.CronJob('0 0 11 * * *', whitehall.fetchAndBroadcast),
      new cron.CronJob('0 0 21 * * *', whitehall.fetchAndBroadcast),
    ]

    log.i('Register jobs')
    jobs.forEach(j => j.start())
    onExit(() => jobs.forEach(j => j.stop()))
  })
  .then(() => {
    log.i('Start polling')
    bot.startPolling()
  })
