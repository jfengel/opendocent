const HttpStatus = require('http-status-codes')
const {userMay,authenticate} = require('./authenticate');
const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, ADMINISTRATE, VESTIBULE_DB, TOUR_DB,
  ROLE_CONTRIBUTOR} = require('./constants');
const faunadb = require('faunadb')
const ManagementClient = require('auth0').ManagementClient;
const nodemailer = require('nodemailer');

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

const sendEmail = (from, to, subject, text) => {
  return new Promise((success, failure) => {
    let transporter = nodemailer.createTransport({
      service: 'SendInBlue', // no need to set host or port etc.
      auth: {
        user: 'catchall@purgo.net',
        pass: process.env.SENDINBLUE_SECRET
      }});

      transporter.sendMail({
        from,
        to,
        subject,
        text
      }, function(error, info) {
        if (error) {
          failure(error);
        } else {
          success(info);
        }
      });
    })
}

const approveUser = async (user) => {
  const p = new Promise((success, failure) => {
    auth0.assignRolestoUser({ id: user }, { roles: [ROLE_CONTRIBUTOR] },
      (error) => {
        if (error) {
          failure(error);
        } else {
          success();
        }
      })
  });
  await p;
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
  const tour = params[0];
  try {
    const vestibuleTour = q.Ref(VESTIBULE_DB, tour)
    const data = await client.query(q.Get(vestibuleTour))
    const result = await client.query(q.Create(TOUR_DB, data))
    await client.query(q.Delete(vestibuleTour));
    await approveUser(user.sub);
    const info = await sendEmail('opendocent@purgo.net', user.email,
      'Your OpenDocent submission has been approved',
      `Thank you for sending us your tour named ${data.name}. It looks like fun!
      It's up on our web site now, so lots of people can take your tour (or just
      browse it from home).
      
      Thanks for helping us build OpenDocent.`)
    console.info('sendemail', info);
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
