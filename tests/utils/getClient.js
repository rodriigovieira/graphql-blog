import ApolloBoost from 'apollo-boost'

// If a JWT token is provided in the getClient() call,
// then the headers of this client instance will be set
// using the provided token.

const getClient = (jwt = null) => {
  return new ApolloBoost({
    uri: "http://localhost:4000",
    request(operation) {
      if (jwt) {
        operation.setContext({
          headers: { Authorization: `Bearer ${jwt}` }
        })
      }
    }
  })
}

export default getClient
