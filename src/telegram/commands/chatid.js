export default {
  admin: true,
  name:  'chatid',
  text:  '❓Где я',
  call:  ctx =>
  // eslint-disable-next-line
  ctx.replyWithMarkdown('```\n' + JSON.stringify(ctx.message, null, 2) + '\n```'),
}
