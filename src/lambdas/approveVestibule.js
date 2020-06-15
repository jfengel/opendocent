const HttpStatus = require('http-status-codes')
const {userMay,authenticate} = require('./authenticate');
const { ADMINISTRATE, VESTIBULE_DB, TOUR_DB } = require('./constants');
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
  const params = event.path.split('/').reverse();
  const tour = params[0];
  try {
    const vestibuleTour = q.Ref(VESTIBULE_DB, tour)
    const data = await client.query(q.Get(vestibuleTour))
    const result = await client.query(q.Create(TOUR_DB, data))
    await client.query(q.Delete(vestibuleTour));
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(result, null, 4)
    })
  } catch(error) {
      console.error("error", error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error, null, 4)
      })
    }
}
