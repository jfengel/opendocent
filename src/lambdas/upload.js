const faunadb = require('faunadb')
const fetch = require('node-fetch')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})

exports.handler = async (event, context, callback) => {
  let user;
  console.info('authorization', event.headers.authorization)
  try {
    user = await fetch('https://opendocent.auth0.com/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': event.headers.authorization
      }
    });
  } catch(e) {
    console.error('error', e);
    callback(null, {
      statusCode: 403,
      body: JSON.stringify(e, null, 4),
    })
    return;
  }
  // console.info('user', user, user.headers);
  console.info('body', JSON.stringify(await user.json(), null, 4));
  if(!user) {
    console.error('User not found');
    callback(null, {
      statusCode: 403,
      body: 'User not found',
    })
    return;
  }

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
