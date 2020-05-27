const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})
exports.handler = async (event, context, callback) => {
  const tour = event.path.split('/').reverse()[0];
  return client.query(q.Get(q.Ref(q.Ref("collections/tours"), tour)))
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
