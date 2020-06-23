const HttpStatus = require('http-status-codes')
const {userMay,authenticate} = require('./lib/authenticate');
const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, ADMINISTRATE, VESTIBULE_DB} = require('./constants');
const faunadb = require('faunadb')
const ManagementClient = require('auth0').ManagementClient;
const {sendEmail} = require('./lib/sendEmail');

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})

const auth0 = new ManagementClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_MGMT_SECRET,
  // scope: "read:users write:users",
  audience: `https://${AUTH0_DOMAIN}/api/v2/`,
  tokenProvider: {
    enableCache: true,
    cacheTTLInSeconds: 10
  }
});

const banUser = async (user) => {
    return auth0.updateUser({ id: user }, { blocked: true })
}


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
  const tourId = params[0];
  try {
    const vestibuleTour = q.Ref(VESTIBULE_DB, tourId)
    const tour = await client.query(q.Get(vestibuleTour))
    const user = await auth0.getUser({id : tour.data.userId});

    await client.query(q.Delete(vestibuleTour));
    const data = JSON.parse(event.body)

    if(data.text) {
      await sendEmail('opendocent@purgo.net', user.email,
        'Your OpenDocent submission has been rejected',
        `Thank you for sending us your tour named ${data.name}, but we can't accept it.
        ${data.text}`)
    }
    if(data.banUser) {
      banUser(user.user_id);
    }

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Rejected' }, null, 4)
    })
  } catch(error) {
      console.error("error", error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error, null, 4)
      })
    }
}
