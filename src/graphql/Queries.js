export const GET_ISSUES_OF_REPOSITORY = `
  query (
    $organization: String!, 
    $repository: String!, 
    $cursor: String
  ) {
    organization(login: $organization) {
      name:
      url
      repository(name: $repository) {
        id
        name
        url
        stargazers {
          totalCount
        }
        viewerHasStarred
        issues(first: 5, after: $cursor, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
              createdAt
              state
              author {
                login
              }
              reactions(last: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

export const ADD_STAR = `
  mutation ($repositoryId: ID!) {
    addStar(input:{starrableId: $repositoryId}) {
      starrable {
        viewerHasStarred
      }
    }
  }
`

export const REMOVE_STAR = `
  mutation ($repositoryId: ID!) {
    removeStar(input:{starrableId: $repositoryId}) {
      starrable {
        viewerHasStarred
      }
    }
  }
`
