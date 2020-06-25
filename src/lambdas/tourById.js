const { TOUR_DB, VESTIBULE_DB } = require('./constants')

const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})
exports.handler = async (event, context, callback) => {
  const params = event.path.split('/').reverse();
  const tour = params[0];
  const db = params[1] === 'vestibule'
    ? VESTIBULE_DB
    : TOUR_DB
  return client.query(q.Get(q.Ref(db, tour)))
    .then((response) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response.data, null, 4)
      })
    }).catch((error) => {
      console.error("error", error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error, null, 4)
      })
    })
}
