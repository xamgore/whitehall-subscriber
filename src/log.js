import ch from 'chalk'

const i = (...args) => console.info(`${ch.white.bgYellow('i')}`, ...args)
const w = (...args) => console.warn(`${ch.white.bgBlue('i')}`, ...args)
const e = (...args) => console.error(`${ch.white.bgRed('E')}`, ...args)

export default { i, w, e }
