const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body)

  const tour = { data }
  return client.query(q.Create(q.Ref("collections/tours"), tour))
    .then((response) => {
      console.log("success", response)
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
