const faunadb = require('faunadb')
const jsonwebtoken = require('jsonwebtoken');

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET
})

// From https://opendocent.auth0.com/pem and https://opendocent.auth0.com/.well-known/jwks.json
// Should probably stop caching this, actually. I was experimenting about performance.
const pem = `-----BEGIN CERTIFICATE-----
MIIDAzCCAeugAwIBAgIJEB5KV8zyKOtdMA0GCSqGSIb3DQEBCwUAMB8xHTAbBgNV
BAMTFG9wZW5kb2NlbnQuYXV0aDAuY29tMB4XDTIwMDUyMTE4MDIyNVoXDTM0MDEy
ODE4MDIyNVowHzEdMBsGA1UEAxMUb3BlbmRvY2VudC5hdXRoMC5jb20wggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDETwRHxwrk6miKmSXtQt+0jh+g6+eU
m1QdM9qHwnqu4h/IGBImGnRmD8cRTbsQM/2VQpgAnp+YC4RStSi0Js4vywMziKQ/
Q07xmzbrrZE7QZolbr4LPWUcO6LtZQjgyEG9xzXtqYrCheJE/8f7OJGHHtHJqN7N
yjjnFeDYHz9nGGbkPal1OcHbK25pN4BGwui401jS0fJo1ua5YIOLxaxxBFae80A2
KRnmi9ibAQFmDdGNE4SFAwsz0cUk3qnGEpCG186bLqMylbs2ya5Sd2OH9RrAi5HM
uahO0PskI2kQ1lWHQsSt0wd10v4ZfBoA6MDlrYWfnTy9gW9F89lu4WABAgMBAAGj
QjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFK+JIrNyt/QzN3gcKJ4k4mqq
Ijy7MA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAFCrBuF5EudwC
eZ0P1KKA/keWTdPUBEkqVjy24IUgSr+OOrsrOdpm3pSYZOwSTalVnpBx1YQ0MfIk
ot8e6zhprgGCEVC1kYhVCG9CJcB27ny/H4on6Hrcldp8d88GGuTS9C2ur9hwBySo
zZjga+YxoS64FXXCHBqmS2AK6fiylGCcTx7e5zjvYEjidW9SILSTelv9SHO7Y2OF
VTu75ayZv9zIBbvC7ZsSPKqw4SSF9ijHYrCGfCy8sX3wyrelYuhTjx8GDSGU1ghw
rSDfm4Nb9gIHPCx2o6fuRvou5Z/rbbPjrfWPOq05VO+F48NaFJ54aLKVCjtFJl1g
bnc8OwBYpw==
-----END CERTIFICATE-----`

exports.handler = async (event, context, callback) => {

  const data = JSON.parse(event.body)

  try {
    const token = event.headers.authorization.split(' ')[1];

    const user = jsonwebtoken.verify(token, pem);
    if(!user) {
      // This shouldn't happen
    }
  } catch(e) {
    callback(null, {
      statusCode: 403,
      body: JSON.stringify(e)
    })
  }

  const tour = { data }
  return client.query(q.Create(q.Ref("collections/tours"), tour))
    .then((response) => {
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
