import getUserId from '../utils/getUserId'

const Subscription = {
  comment: {
    async subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.comment({
        where:
          { node: { post: { id: args.postId } } }
      }, info)
    }
  },

  post: {
    async subscribe(parent, args, { prisma }, info) {
      const opArgs = { where: { node: { published: true } } }

      if (args.postId) {
        opArgs.where = {
          node: {
            AND: [
              { id: args.postId },
              { published: true }
            ]
          }
        }
      }

      return prisma.subscription.post(opArgs, info)
    }
  },
  myPost: {
    async subscribe(parent, args, { prisma, request }, info) {
      const userId = getUserId(request)

      return prisma.subscription.post({
        where: { node: { author: { id: userId } } }
      }, info)
    }
  }
}

export { Subscription }
