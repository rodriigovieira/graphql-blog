import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import prisma from '../../src/prisma'

// Define user and post objects, so that the id
// and token fields can be retrieved and, then, exported.

const userOne = {
  input: {
    email: "testuser@test.com",
    password: bcrypt.hashSync('AoInfinitoEAlem!'),
    name: "TestUser"
  },
  user: null,
  token: null
}

const userTwo = {
  input: {
    email: "iamatestuser@test.com",
    password: bcrypt.hashSync('OrdemEProgresso'),
    name: "Tester"
  },
  user: null,
  token: null
}

const postOne = {
  input: {
    title: "Test Post 1",
    body: "Text Post 1",
    published: true,
  },
  post: null
}

const postTwo = {
  input: {
    title: "Test Post 2",
    body: "Test Post 2",
    published: false,
  },
  post: null
}

const commentOne = {
  input: { text: "Comment One" },
  comment: null,
}

const commentTwo = {
  input: { text: "Wow! Another Comment!" },
  comment: null,
}

const seedDatabase = async () => {
  // Delete all users, comments and posts
  // so that fresh data is avaibale to be tested.
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // Create a user with the data provided above
  // and store the output of the call to the "user" field.
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })

  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  })

  // Generate a token for these users and
  // store them in their variables.
  userOne.token = jwt.sign(
    { userId: userOne.user.id },
    process.env.JWT_SECRET
  )

  userTwo.token = jwt.sign(
    { userId: userTwo.user.id },
    process.env.JWT_SECRET
  )

  // Create two dummy posts to seed the database.
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: { connect: { email: userOne.user.email } }
    }
  })

  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: { connect: { email: 'testuser@test.com' } }
    }
  })

  // Create two dummy comments to seed the database.
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: { connect: { id: userTwo.user.id } },
      post: { connect: { id: postOne.post.id } }
    }
  })

  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: { connect: { id: userOne.user.id } },
      post: { connect: { id: postTwo.post.id } }
    }
  })
}

export {
  seedDatabase as default,
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo,
}
