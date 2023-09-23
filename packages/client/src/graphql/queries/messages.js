import { gql } from '@apollo/client'

export const GET_MESSAGES = gql`
    query messages (
        $roomId: ID!
        $offset: Int!
        $limit: Int!
    ) {
        conversations(
            roomId: $roomId, 
            offset: $offset, 
            limit: $limit
        ) {
            messages {
                id
                sender
                text
                ts
            }
            havingNext
        }
    }
`