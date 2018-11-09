import React, { Component } from 'react';
import { Organization } from './component/Organization'
import { 
  getIssuesOfRepository, 
  resolveIssuesQuery,
  addStarToRepository,
  resolveAddStarMutation,
  removeStarToRepository,
  resolveRemoveStarMutation
} from './graphql/AxiosRequest'

import './App.css';

const title = 'React Graphql Github Client';

class App extends Component {
  state={
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  };

  componentDidMount() {
    this.onFetchFromGitHub(this.state.path);
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onSubmit = event => {
    // fetch data
    this.onFetchFromGitHub(this.state.path);
    event.preventDefault();
  };

  onFetchFromGitHub = (path, cursor) => {
    getIssuesOfRepository(path, cursor).then(queryResult =>
      this.setState(resolveIssuesQuery(queryResult, cursor)),
    )
  }

  onFetchMoreIssues = () => {
    const { endCursor } = this.state.organization.repository.issues.pageInfo;
    this.onFetchFromGitHub(this.state.path, endCursor)
  }

  onStarRespository = (repositoryId, viewerHasStarred) => {
    if(!viewerHasStarred) { 
      addStarToRepository(repositoryId).then(mutationResult => 
        this.setState(resolveAddStarMutation(mutationResult))
      );
    } else {
      removeStarToRepository(repositoryId).then(mutationResult =>
        this.setState(resolveRemoveStarMutation(mutationResult))
      );
    }
  }

  render() {
    const { path, organization, errors } = this.state;    

    return (
      <div>
        <h1>{title}</h1>

        <form onSubmit={this.onSubmit}>
           <label htmlFor="url">
            Show open issues for https://github.com/
          </label>
          <input
            id="url"
            type="text"
            value={path}
            onChange={this.onChange}
            style={{ width: '300px' }}
          />
          <button type="submit">Search</button>
        </form>

        <hr />

        { organization ? (
          <Organization 
            organization={organization} 
            errors={errors} 
            onFetchMoreIssues={this.onFetchMoreIssues} 
            onStarRespository={this.onStarRespository} 
          />
        ) : (
          <p>No information yet ...</p>
        )}

      </div>
    );
  }
}

export default App;
