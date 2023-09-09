import { gql } from '@apollo/client'

export const REGISTER = gql`
    mutation register (
        $firstName:String
        $lastName: String
        $username: String!
        $email: String!
        $password: String!
    ) {
        register(
            data: { 
                username: $username, 
                email: $email, 
                password: $password
                firstName: $firstName
                lastName: $lastName
            }
        ) {
            username
        }
    }
`