# OpenDocent

An application for sharing and using online tour guides

## Infrastructure configuration
This application uses
* Auth0 for user identity
* Faunadb as the database
* Netlify as the server

### FaunaDB

* Create tours and vestibule collections
* Store key in environment variable FAUNA_SERVER_SECRET
* Configure token following https://community.auth0.com/t/how-do-i-get-role-claims-added-to-my-access-token/28761/2

### Auth0
* Obtain pem from https://opendocent.auth0.com/pem and store it in src/lambdas/constants.js


