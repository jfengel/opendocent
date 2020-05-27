const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})
exports.handler = async (event, context, callback) => {
  return client.query(q.Map(q.Paginate(q.Documents(q.Collection("tours"))),
    q.Lambda("X", [
      q.Select(["ref"], q.Get(q.Var("X")), ""),
      q.Select(["data", "name"], q.Get(q.Var("X")), ""),
      q.Select(["data", "description"], q.Get(q.Var("X")), ""),
      q.Select(["data", "ExtendedData"], q.Get(q.Var("X")), "")
    ])))
    .then((response) => {
      const result = response.data.map(([ref, name, description, extendedData]) => {
        console.info('ref=', ref, ref["@ref"])
        return {ref : ref.id, name, description, extendedData}
      });
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(result, null, 4)
      })
    }).catch((error) => {
      console.error("error", error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error, null, 4)
      })
    })
}
