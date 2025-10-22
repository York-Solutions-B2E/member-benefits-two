import { gql } from '@apollo/client';

export const GET_CLAIMS = gql`
    query Claims($filters: ClaimsFilter, $pagination: PaginationInput) {
        claims(filters: $filters, pagination: $pagination) {
            edges {
                node {
                    id
                    claimNumber
                    status
                    serviceStartDate
                    serviceEndDate
                    totalMemberResponsibility
                    provider {
                        id
                        name
                        specialty
                    }
                }
                cursor
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            totalCount
        }
    }
`;