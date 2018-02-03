import whitehall from '../../whitehall/broadcast'

export default {
  name:  'fetch',
  text:  '📬 Фетч',
  admin: true,
  call:  ctx => whitehall.fetchAndSend(ctx.chat.id),
}
