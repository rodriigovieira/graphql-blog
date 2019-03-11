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
    const userId = getUserId(request)

    const opArgs = { where: { author: { id: userId } } }

    if (args.published !== null) {
      opArgs.where = {
        published: args.published,
        author: { id: userId }
      }
    }

    return prisma.query.posts(opArgs, info)
  },

  users(parent, args, { db, prisma }, info) {
    const opArgs = {}

    if (args.query) {
      opArgs.where = { name_contains: args.query }
    }

    return prisma.query.users(opArgs, info)
  },

  posts(parent, args, { db, prisma }, info) {
    const opArgs = { where: { published: true } }

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

  comments(parent, args, { db, prisma }, info) {
    return prisma.query.comments(null, info)
  }
}

export { Query }
