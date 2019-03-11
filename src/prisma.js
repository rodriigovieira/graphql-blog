import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'https://us1.prisma.sh/rodrigo-vieira-a7c6bd/demo/test ',
    secret: 'secret',
    fragmentReplacements
})

export { prisma as default }
