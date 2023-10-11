const M = require('./mutations')
const Q = require('./queries')

const resolvers = {
    Mutation: {
        login: M.login,
        register: M.register
    },
    Query: {
        rooms: Q.rooms,
        conversations: Q.conversations,
        accountInfos: Q.accountInfos
    }
}

module.exports = resolvers