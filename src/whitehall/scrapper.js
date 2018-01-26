import osmos from 'osmosis'
import moment from 'moment'
import run from './runner'
import l from '../log'

const getEventsOn = date =>
  run(osmos
    .get(`http://whitehall.spbstu.ru/events/?dater=${date || ''}`)
    .paginate('.pagination > li > a[rel=next]')
    .find('.scedule > li')
    .set({
      title: 'a.title',
      time:  '.data-sect > .clock',
      day:   '.data-sect > .data',
      month: '.data-sect > .month',
      week:  '.data-sect > .week',
      price: '.price',
      link:  'a.title@href',
    }))


const getAll = async () => {
  l.i('Run scrapper')
  let date = moment()

  let result = []
  for (let i = 1; i <= 2; i++, date.startOf('month').add(1, 'month')) {
    result.push(...await getEventsOn(date.format('YYYY-MM-DD')))
  }

  if (result === [])
    throw new Error('Empty results after scrapping')

  return result
}

export default getAll
