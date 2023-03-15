const app = require('express')()
const bodyParser = require('body-parser')
const s3Upload = require('./s3Upload')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.status(200).send('hi')
})
app.use('/s3upload', s3Upload)

// Error Handle
app.use(function (err, req, res, next) {
  res.status(500)
  res.json({ error: err.message })
})

module.exports = {
  path: '/api/',
  handler: app,
}
