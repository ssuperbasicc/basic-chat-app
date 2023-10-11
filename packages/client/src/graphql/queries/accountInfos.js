import { gql } from '@apollo/client'

export const GET_ACCOUNT_INFOS = gql`
    query accountInfos ( $userId: Int! ) {
        accountInfos(userId: $userId) {
            firstName
            lastName
            username
        }
    }
`