/** From https://opendocent.auth0.com/pem and https://opendocent.auth0.com/.well-known/jwks.json
 * Should probably stop caching this, actually. I was experimenting about performance.
 */
exports.pem = `-----BEGIN CERTIFICATE-----
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

const q = require('faunadb').query;

exports.TOUR_DB = q.Ref("collections/tours")
exports.VESTIBULE_DB = q.Ref("collections/vestibule")

exports.ADMINISTRATE = 'Administrator'
exports.CONTRIBUTE = 'Contributor'
exports.CLAIMS_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

exports.AUTH0_CLIENT_ID = 'M0ACG5QykJeTA8EVLkI5wiQmwtNjvhlq';
exports.AUTH0_URL = 'https://opendocent.auth0.com'
exports.AUTH0_DOMAIN = 'opendocent.auth0.com'
exports.ROLE_CONTRIBUTOR = 'rol_JV40b0FI69a752XG';  // TODO this should be looked up instead




