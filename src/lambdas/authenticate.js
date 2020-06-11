const { CLAIMS_ROLE, pem } = require('./constants')
const HttpStatus = require('http-status-codes')
const jsonwebtoken = require('jsonwebtoken');

exports.userMay = (user, role) => {
  return user[CLAIMS_ROLE].indexOf(role) >= 0;
}
exports.authenticate = (event, context, callback) => {
  try {
    if(!event.headers.authorization) {
      return callback(null, {
        statusCode: HttpStatus.UNAUTHORIZED,
        body: JSON.stringify({message: 'Authentication required'})
      })
    }
    const token = event.headers.authorization.split(' ')[1];

    return jsonwebtoken.verify(token, pem);
  } catch(e) {
    console.error('Authentication error', e);
    callback(null, {
      statusCode: HttpStatus.UNAUTHORIZED,
      body: JSON.stringify({message: e.message})
    })
    return null;
  }
}
