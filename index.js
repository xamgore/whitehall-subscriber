require('babel-polyfill')
require('babel-register')({
  presets: ['env'],
  plugins: ['transform-object-rest-spread', 'add-module-exports'],
})


let fs = require('fs')

if (!fs.existsSync('.env'))
  fs.writeFileSync('.env', fs.readFileSync('.env.example'))


require('dotenv').config()
require('./src/app')
