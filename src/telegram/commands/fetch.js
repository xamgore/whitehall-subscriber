import whitehall from '../../whitehall/broadcast'

export default {
  name: 'fetch',
  text: '📬 Афиша',
  call: ctx => whitehall.fetchAndSend(ctx.chat.id),
}
