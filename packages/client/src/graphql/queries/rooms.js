import { gql } from '@apollo/client'

export const GET_ROOMS = gql`
    query rooms (
        $userId: Int!
    ) {
        rooms(userId: $userId) {
            id
            name
            nameFormat {
                uid1
                uname1
                uid2
                uname2
            }
            flagForum
            createTs
            lastMessageTs
        }
    }
`