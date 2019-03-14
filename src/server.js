import '@babel/polyfill/noConflict'

import { GraphQLServer, PubSub } from 'graphql-yoga'

import prisma from './prisma'
import { resolvers, fragmentReplacements } from './resolvers'

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return { prisma, request, PubSub }
  },
  fragmentReplacements
})

export default server
