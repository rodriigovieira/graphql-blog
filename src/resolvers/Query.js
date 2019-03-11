import getUserId from '../utils/getUserId'

const Query = {
  async post(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request, false)

    const posts = await prisma.query.posts({
      where: {
        id,
        OR: [
          { published: true },
          { author: { id: userId } },
        ]
      }
    }, info)

    if (posts.length === 0) throw new Error('Post not found.')

    return posts[0]
  },

  async me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, true)

    return prisma.query.user({ where: { id: userId } })
  },

  async myPosts(parent, args, { prisma, request }, info) {
    // Return all posts for this particular user,
    // requiring the user to be authenticated.
    const userId = getUserId(request)

    const opArgs = {
      where: { author: { id: userId } },
      after: args.after,
      skip: args.skip,
      first: args.first,
    }

    if (args.published !== null) {
      opArgs.where = {
        published: args.published,
        author: { id: userId }
      }
    }

    return prisma.query.posts(opArgs, info)
  },

  users(parent, args, { db, prisma }, info) {
    // Destructuring and adding pagination/sorting support.
    const { first, skip, query, after, orderBy } = args

    const opArgs = { first, skip, after, orderBy }

    if (query) {
      opArgs.where = { name_contains: query }
    }

    return prisma.query.users(opArgs, info)
  },

  posts(parent, args, { db, prisma }, info) {
    // Only allow published posts to be retrieved.
    // Also, adding pagination support.
    const opArgs = {
      where: { published: true },
      skip: args.skip,
      first: args.first,
      after: args.after,
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where = {
        published: true,
        OR: [
          { title_contains: args.query },
          { body_contains: args.query },
        ]
      }
    }

    return prisma.query.posts(opArgs, info)
  },

  comments(parent, { first, skip, after, orderBy }, { db, prisma }, info) {
    // Pagination And Sorting Support
    const opArgs = { first, skip, after, orderBy }
    
    return prisma.query.comments(opArgs, info)
  }
}

export { Query }
