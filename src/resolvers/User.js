import getUserId from '../utils/getUserId'

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      // Checking if user is authenticating, but passing
      // the "not required" option in the 2nd argument.
      const userId = getUserId(request, false)

      // If the User ID exists, and it matches the ID
      // of the user being queried, then the email'll
      // be returned. Otherwise, the email won't appear..
      return userId && (userId === parent.id) ? parent.email : null
    }
  },

  password(parent, args, ctx, info) {
    return 'hidden'
  },

  posts: {
    fragment: 'fragment userId on User { id }',
    async resolve(parent, args, { prisma }, info) {
      // Fetch all posts that were created by the user
      // and have the published property set to true.
      return prisma.query.posts({
        where: {
          published: true,
          author: { id: parent.id }
        }
      }, info)
    }
  }
}

export { User }
