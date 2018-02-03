import main from '../stages/main'

export default {
  name: 'settings',
  text: '⚙️ Настройки',
  async call(ctx) {
    ctx.reply('😬 Здесь пока ничего нет', await main.menu(ctx))
    ctx.scene.enter('main')
  },
}
