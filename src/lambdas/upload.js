const faunadb = require('faunadb')
const jsonwebtoken = require('jsonwebtoken');
const { pem } = require('./constants');
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})

exports.handler = async (event, context, callback) => {

  const data = JSON.parse(event.body)

  try {
    const token = event.headers.authorization.split(' ')[1];

    const user = jsonwebtoken.verify(token, pem);
    if(!user) {
      // This shouldn't happen
    }
  } catch(e) {
    callback(null, {
      statusCode: 403,
      body: JSON.stringify(e)
    })
  }

  const tour = { data }
  return client.query(q.Create(q.Ref("collections/tours"), tour))
    .then((response) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response, null, 4)
      })
    }).catch((error) => {
      console.error("error", error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error, null, 4)
      })
    })
}
