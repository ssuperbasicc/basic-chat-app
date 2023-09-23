import { ApolloClient, InMemoryCache } from '@apollo/client'

const {
    REACT_APP_BASE_URL,
    REACT_APP_GQL_PATH
} = process.env

const uri = `${REACT_APP_BASE_URL}${REACT_APP_GQL_PATH}`

const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
})

export default client