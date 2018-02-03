import MenuScene from '../menu-scene'
import mkKeyboard from '../keyboard'
import start from '../commands/start'


const scene = new MenuScene('guest')

scene.commands([start])


const menu = () => mkKeyboard([start])


export default { scene, menu }
