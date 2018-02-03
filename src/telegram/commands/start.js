import main from '../stages/main'


export default {
  name: 'start',
  text: 'Перейти в главное меню',
  async call(ctx) {
    await ctx.reply('Добро пожаловать!', await main.menu(ctx))
    ctx.scene.enter('main')
  },
}
