const app = require('express')()
const bodyParser = require('body-parser')
const s3Operations = require('./s3Operations')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/s3', s3Operations)

// Error Handle
app.use(function (err, req, res, next) {
  res.status(500)
  res.json({ error: err.message })
})

module.exports = {
  path: '/api/',
  handler: app,
}
