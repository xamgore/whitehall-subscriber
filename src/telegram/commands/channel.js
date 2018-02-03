export default {
  name:  'channel',
  text:  '📰 Режим канала',
  admin: true,
  call:  ctx => ctx.scene.enter('channel'),
}
