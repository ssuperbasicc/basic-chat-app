const M = require('./mutations')
const Q = require('./queries')

const resolvers = {
    Mutation: {
        
    },
    Query: {
        rooms: Q.rooms,
        conversations: Q.conversations
    }
}

module.exports = resolvers