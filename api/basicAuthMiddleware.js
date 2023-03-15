require('dotenv').config()
const basicAuth = require('basic-auth')

const basicAuthMiddleware = function (req, res, next) {
  const user = basicAuth(req)

  if (
    user === undefined ||
    user.name !== process.env.USER_NAME ||
    user.pass !== process.env.PASSWORD
  ) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"')
    res.end('Unauthorized')
  } else {
    next()
  }
}

module.exports = {
  basicAuthMiddleware,
}
