var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

const gql = require('graphql-tag')
const { ApolloServer } = require('@apollo/server')
const { buildSubgraphSchema  } = require('@apollo/subgraph')
const { expressMiddleware } = require('@apollo/server/express4')

const resolvers = require('./graphql/resolvers')
const { readFileSync  } = require('fs')
const cors = require('cors')

const appBuild = async function () {
    var app = express()

    app.use(logger('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(cors())

    const typeDefs = gql(
        readFileSync(
            "graphql/schema.graphql",
            { encoding: "utf-8" }
        )
    )

    const schema = buildSubgraphSchema({ typeDefs, resolvers })

    const gqlServer = new ApolloServer({
        schema
    })

    await gqlServer.start()

    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(gqlServer)
    )

    return app
}

module.exports = appBuild
