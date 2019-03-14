import 'cross-fetch/polyfill'

import getClient from './utils/getClient'
import seedDatabase, { userOne } from './utils/seedDatabase'
import { getProfile, login, getUsers, createUser } from './utils/operations'

import prisma from '../src/prisma'

jest.setTimeout(300000)

const client = getClient()

beforeEach(seedDatabase)

test("should create a new user", async () => {
  const variables = {
    data: {
      name: "Lord of The Rings",
      email: "lord@rings.com",
      password: "secretLord"
    }
  }

  await client.mutate({ mutation: createUser, variables })

  const exists = await prisma.exists.User({ email: 'lord@rings.com' })

  expect(exists).toBe(true)
})

test('should expose public authors profiles', async () => {
  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(2)
  expect(response.data.users[0].email).toBe(null)
  expect(typeof response.data.users[0].name).toBe('string')
})

test('should not authenticate with wrong credentials', async () => {
  const variables = {
    data: {
      email: "wrongemail@willfail.com",
      password: "incorrect123"
    }
  }

  await expect(
    client.mutate({ mutation: login, variables })
  ).rejects.toThrow()
})

test('should return error if signing up with weak password', async () => {
  const variables = {
    data: {
      email: "user@tocreate.com",
      password: "create",
      name: "User Created"
    }
  }

  await expect(client.mutate({ mutation: createUser, variables }))
    .rejects.toThrow()
})

test('should fetch user profile', async () => {
  const client = getClient(userOne.token)

  const response = await client.query({ query: getProfile })

  expect(response.data.me.email).toBe(userOne.user.email)
  expect(response.data.me.id).toBe(userOne.user.id)
})
