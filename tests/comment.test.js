import 'cross-fetch/polyfill'

import getClient from './utils/getClient'
import seedDatabase, { commentOne, commentTwo, userOne, userTwo } from './utils/seedDatabase'
import { deleteComment } from './utils/operations'

import prisma from '../src/prisma'

jest.setTimeout(300000)

beforeEach(seedDatabase)

test('should delete own comment', async () => {
  const client = getClient(userOne.token)

  const variables = { id: commentTwo.comment.id }

  const { data } = await client.mutate({ mutation: deleteComment, variables })

  const exists = await prisma.exists.Comment({ id: commentTwo.comment.id })

  expect(exists).toBe(false)
  expect(data.deleteComment.text).toBe(commentTwo.comment.text)
})

test('should not delete other users comments', async () => {
  const client = getClient(userOne.token)

  const variables = { id: commentOne.comment.id }

  await expect(client.mutate({ mutation: deleteComment, variables }))
    .rejects.toThrow()
})
