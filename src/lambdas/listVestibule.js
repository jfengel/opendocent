const HttpStatus = require('http-status-codes')
const {userMay,authenticate} = require('./lib/authenticate');
const { ADMINISTRATE, VESTIBULE_DB } = require('./constants');
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})
exports.handler = async (event, context, callback) => {
  const user = authenticate(event, context, callback);
  if (!user) {
    return;
  }
  if (!userMay(user, ADMINISTRATE)) {
    return callback(null, {
      statusCode: HttpStatus.FORBIDDEN,
      body: JSON.stringify({
        message: 'You do not have permission.' })
    })
  }

    return client.query(q.Map(q.Paginate(q.Documents(VESTIBULE_DB)),
    q.Lambda("X", [
      q.Select(["ref"], q.Get(q.Var("X")), ""),
      q.Select(["data", "name"], q.Get(q.Var("X")), ""),
      q.Select(["data", "description"], q.Get(q.Var("X")), ""),
      q.Select(["data", "ExtendedData"], q.Get(q.Var("X")), "")
    ])))
    .then((response) => {
      const result = response.data.map(([ref, name, description, extendedData]) => {
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
