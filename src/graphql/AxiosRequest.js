import axios from 'axios';
import { 
    GET_ISSUES_OF_REPOSITORY,
    ADD_STAR,
    REMOVE_STAR,
} from './Queries';

export const axiosGitHubGraphQL = axios.create({
    baseURL: 'https://api.github.com/graphql',
    headers: {
      Authorization: `bearer ${
        process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
      }`,
    },
});

export const getIssuesOfRepository = (path, cursor) => {
    const [organization, repository] = path.split('/');
  
    return axiosGitHubGraphQL.post('', {
      query: GET_ISSUES_OF_REPOSITORY,
      variables: { organization, repository, cursor },
    });
}
  
export const resolveIssuesQuery = (queryResult, cursor) => state => {
    const { data, errors } = queryResult.data;
  
    if (!cursor) {
      return {
        organization: data.organization,
        errors,
      };
    }
  
    const { edges: oldIssues } = state.organization.repository.issues;
    const { edges: newIssues } = data.organization.repository.issues;
    const updatedIssues = [...oldIssues, ...newIssues];
  
    return {
      organization: {
        ...data.organization,
        repository: {
          ...data.organization.repository,
          issues: {
            ...data.organization.repository.issues,
            edges: updatedIssues,
          },
        },
      },
      errors,
    };
};
  
export const addStarToRepository = repositoryId => {
    return axiosGitHubGraphQL.post('', {
      query: ADD_STAR,
      variables: { repositoryId },
    })
}
  
export const resolveAddStarMutation = mutationResult => state => {
    const { viewerHasStarred } = mutationResult.data.data.addStar.starrable;
    const { totalCount } = state.organization.repository.stargazers;
  
    return {
      ...state,
      organization: {
        ...state.organization,
        repository: {
          ...state.organization.repository,
          viewerHasStarred,
          stargazers: {
            totalCount: totalCount + 1,
          }
        },
      },
    };
};
  
export const removeStarToRepository = repositoryId => {
    return axiosGitHubGraphQL.post('', {
      query: REMOVE_STAR,
      variables: { repositoryId },
    })
}
  
export const resolveRemoveStarMutation = mutationResult => state => {
    const { viewerHasStarred } = mutationResult.data.data.removeStar.starrable;
    const { totalCount } = state.organization.repository.stargazers;
  
    return {
      ...state,
      organization: {
        ...state.organization,
        repository: {
          ...state.organization.repository,
          viewerHasStarred,
          stargazers: {
            totalCount: totalCount - 1,
          }
        }
      }
    }
}