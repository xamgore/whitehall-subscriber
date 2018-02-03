import ch from 'chalk'

const i = (...args) => console.info(`${ch.white.bgYellow('i')}`, ...args)
const w = (...args) => console.warn(`${ch.white.bgBlue('i')}`, ...args)
const e = (...args) => console.error(`${ch.white.bgRed('!')}`, ...args)
const cmd = (c, ...args) => console.log(`\n${ch.magentaBright(c)}`, ...args)

const user = from =>
  `${from.username ? `@${from.username}` : from.first_name} (${from.id})`

export default { i, w, e, cmd, user }
