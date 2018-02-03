import whitehall from '../../whitehall/broadcast'

export default {
  name:  'broadcast',
  text:  '🎙 Бродкаст',
  admin: true,
  call:  whitehall.fetchAndBroadcast,
}
