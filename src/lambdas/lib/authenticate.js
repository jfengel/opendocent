const { CLAIMS_ROLE, pem } = require('../constants')
const HttpStatus = require('http-status-codes')
const jsonwebtoken = require('jsonwebtoken');
const { ADMINISTRATE } = require('../constants');

const userMay = (user, role) => {
  return user[CLAIMS_ROLE].indexOf(role) >= 0;
}
exports.userMay = userMay;

const authenticate = (event, context, callback) => {
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
exports.authenticate = authenticate;

exports.administrator = (event, context, callback) => {
  const admin = authenticate(event, context, callback);
  if (!admin) {
    return false;
  }
  if (!userMay(admin, ADMINISTRATE)) {
    callback(null, {
      statusCode: HttpStatus.FORBIDDEN,
      body: JSON.stringify({
        message: 'You do not have permission.' })
    })
    return false;
  }
  return true;
}
