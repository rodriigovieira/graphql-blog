import bcrypt from 'bcryptjs'

import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  async loginUser(parent, args, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: args.data.email } })

    if (!user) throw new Error(`User with email ${args.data.email} does not exist.`)

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) throw new Error('Invalid password.')

    return { user, token: generateToken(user.id) }
  },

  // Users CRUD Methods
  async createUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ email: args.data.email })

    if (userExists) throw new Error(`Email ${args.data.email} is already taken.`)

    const password = await hashPassword(args.data.password)

    const user = await prisma.mutation
      .createUser({ data: { ...args.data, password } })

    return { user, token: generateToken(user.id) }
  },

  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password)
    }

    return prisma.mutation
      .updateUser({ data, where: { id: userId } }, info)
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser({ where: { id: userId } }, info)
  },

  // Posts CRUD Methods
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.createPost({
      data: {
        ...args.data,
        author: { connect: { id: userId } }
      }
    }, info)
  },

  async updatePost(parent, args, { prisma, request }, info) {
    const { id, data } = args

    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({ id })
    const postIsOwnedByUser = await prisma.exists.Post({ author: { id: userId } })
    const postIsPublished = await prisma.exists.Post({
      id,
      published: true
    })

    if (args.data.published === false && postIsPublished) {
      await prisma.mutation.deleteManyComments({
        where: { post: { id } }
      })
    }

    if (!postExists) throw new Error('Post with provided ID not found.')
    if (!postIsOwnedByUser) throw new Error('This post does not belong to you.')

    return prisma.mutation.updatePost({ data, where: { id } }, info)
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists
      .Post({ id: args.id, author: { id: userId } })

    if (!postExists) throw new Error('Unable to delete post.')

    return prisma.mutation.deletePost({ where: { id: args.id } }, info)
  },

  // Comments CRUD Methods
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const post = await prisma.query.post({ where: { id: args.data.post } })

    if (!post) throw new Error('Post with provided ID does not exist.')
    if (!post.published) throw new Error('Post is not published.')

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: { connect: { id: userId } },
        post: { connect: { id: args.data.post } }
      }
    }, info)
  },

  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)

    const commentExists = prisma.exists.Comment({ id, author: userId })

    if (!commentExists) throw new Error('Comment with provided ID does not exist.')

    return prisma.mutation
      .updateComment({ where: { id }, data }, info)
  },

  async deleteComment(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)

    const commentExists = prisma.exists.Comment({ id, author: userId })

    if (!commentExists) throw new Error('Comment with provided ID not found.')

    return prisma.mutation
      .deleteComment({ where: { id } }, info)
  }
}

export { Mutation }
