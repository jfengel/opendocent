const faunadb = require('faunadb')
const jsonwebtoken = require('jsonwebtoken');
const { pem } = require('./constants');
const HttpStatus = require('http-status-codes')
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})

const TOUR_DB = q.Ref("collections/tours")
const VESTIBULE_DB = q.Ref("collections/vestibule")
// const ADMINISTRATE = 'Administrator'
const CONTRIBUTE = 'Contributor'
const CLAIMS_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

const userMay = (user, role) => {
  return user[CLAIMS_ROLE].indexOf(role) >= 0;
}
const authenticate = (event, context, callback) => {
  try {
    const token = event.headers.authorization.split(' ')[1];

    return jsonwebtoken.verify(token, pem);
  } catch(e) {
    callback(null, {
      statusCode: HttpStatus.UNAUTHORIZED,
      body: JSON.stringify(e)
    })
    return null;
  }


}

// This is added to the JWT token following the suggestion in https://community.auth0.com/t/how-do-i-get-role-claims-added-to-my-access-token/28761/2
exports.handler = async (event, context, callback) => {
  const user = authenticate(event, context, callback);
  if (!user) {
    return;
  }
  const data = JSON.parse(event.body)
  data.userId = user.sub;

  const tour = { data }
  let db = VESTIBULE_DB;
  if (userMay(user, CONTRIBUTE)) {
    db = TOUR_DB;
  } else {
    const result = await client.query(q.Paginate(q.Match(q.Index('userId'), user.sub)))
    if(result.data.length > 0) {
      return callback(null, {
        statusCode: HttpStatus.FORBIDDEN,
        body: JSON.stringify({
          message: 'Your first submission is still pending approval. We\'ll try to get to it soon.' })
      })
    }
  }
  const message = db === TOUR_DB
    ? 'Successfully uploaded. Thank you!'
    : 'Thank you. You will be notified when your upload is approved.'


  return client.query(q.Create(db, tour))
    .then((_) => {
      return callback(null, {
        statusCode: HttpStatus.ACCEPTED,
        body: JSON.stringify({ message }, null, 4)
      })
    }).catch((error) => {
      console.error("error", error)
      return callback(null, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        body: JSON.stringify(error, null, 4)
      })
    })
}
