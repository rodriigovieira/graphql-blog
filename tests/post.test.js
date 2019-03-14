import 'cross-fetch/polyfill'

import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import {
  getMyPosts,
  getPosts,
  updatePost,
  createPost,
  deletePost
} from './utils/operations'

import prisma from '../src/prisma'

jest.setTimeout(300000)

const client = getClient()

beforeEach(seedDatabase)

test('should return all published posts', async () => {
  const response = await client.query({ query: getPosts })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test('should fetch myPosts query', async () => {
  const client = getClient(userOne.token)

  const { data } = await client.query({ query: getMyPosts })

  expect(data.myPosts.length).toBe(2)
})

test('should be able to update own post', async () => {
  const client = getClient(userOne.token)

  const variables = {
    id: postOne.post.id,
    data: { published: false }
  }

  const { data } = await client.mutate({ mutation: updatePost, variables })

  const exists = await prisma.exists
    .Post({ id: postOne.post.id, published: false })

  expect(exists).toBe(true)
  expect(data.updatePost.published).toBe(false)
  expect(data.updatePost.id).toBe(postOne.post.id)
})

test('should create post if authenticated', async () => {
  const client = getClient(userOne.token)

  const variables = {
    data: {
      title: "Test Post 3",
      body: "Test, again.",
      published: true
    }
  }

  const { data } = await client.mutate({ mutation: createPost, variables })

  const exists = await prisma.exists.Post({
    title: "Test Post 3",
    body: "Test, again.",
    published: true
  })

  expect(exists).toBe(true)

  expect(data.createPost.title).toBe('Test Post 3')
  expect(data.createPost.body).toBe('Test, again.')
})

test('should delete post if authenticated', async () => {
  const client = getClient(userOne.token)

  const variables = { id: postTwo.post.id }

  const { data } = await client.mutate({ mutation: deletePost, variables })

  const exists = await prisma.exists.Post({ id: postTwo.post.id })

  expect(exists).toBe(false)
  expect(data.deletePost.id).toBe(postTwo.post.id)
})
