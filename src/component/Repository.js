import React from 'react';

const RepositoryIssue = (issue) => (
    <li key={issue.node.id}>
      {RepositoryIssueStat(issue.node)}
      {RepositoryIssueReactions(issue.node.reactions)}
    </li>
);

const RepositoryIssueStat = issue => (
    <div>
      <a href={issue.url}>{issue.title}</a>
      <br />
      <small>Created: {issue.createdAt}</small>
      <br />
      <small>State: {issue.state}</small>
      <br />
      <small>Author: {issue.author.login}</small>
      <br />
      <span>Reactions:</span>
    </div>
  )
  
  const RepositoryIssueReactions = reactions => (
    <ul>
      {
        reactions.edges.map(reaction => (
          <li key={reaction.node.id}>{reaction.node.content}</li>
        ))
      }
    </ul>
  )
  
  export const Repository = ({
    repository, 
    onFetchMoreIssues, 
    onStarRespository
  }) => (
    <div>
      <p>
        <strong>In Repository:</strong>
        <a href={repository.url}>{repository.name}</a>
      </p>
      <button 
        type="button" 
        onClick={() => onStarRespository(repository.id, repository.viewerHasStarred)}>
        {repository.stargazers.totalCount}
        {repository.viewerHasStarred ? 'Unstar' : 'Star'}
      </button>
      <ul>
        {repository.issues.edges.map(issue => RepositoryIssue(issue))}
      </ul>
      <hr />
      {repository.issues.pageInfo.hasNextPage && (
        <button onClick={onFetchMoreIssues}>More</button>
      )}
    </div>
  );