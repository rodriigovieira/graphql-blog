import jwt from 'jsonwebtoken'

// Return the user ID by checking if the authorization key
// in the headers section is valid. If, however, the password
// is invalid, then null will be returned. By default,
// authentication is required.

const getUserId = (request, requireAuth = true) => {
  // On subscriptions, request.request does not exist.
  // Thus, the ternary determines which one should prevail.
  const authKey = request.request ? request.request.headers.authorization : request.connection.context.Authorization

  if (authKey) {
    const token = authKey.replace('Bearer ', '')

    return jwt.verify(token, 'secret').userId
  }

  if (requireAuth) throw new Error('You need to be logged in.')

  return null
}

export default getUserId
