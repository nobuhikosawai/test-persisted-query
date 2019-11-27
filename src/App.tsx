import React from 'react';
import gql from 'graphql-tag';
import './App.css';
import { useQuery } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { DummyContent } from './__generated__/DummyContent';

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      // uri: 'https://sjjcm90bpe.execute-api.ap-northeast-1.amazonaws.com/stg/graphql',
      // uri: 'https://staging-preca.finc.com/graphql',
      uri: 'http://localhost:3001/graphql',
    })
  ]),
  cache: new InMemoryCache()
});


const GET_DUMMY = gql`
  query DummyContent{
    dummyContents {
      id
    }
  }
`;

const App: React.FC = () => {
  const { loading, error, data } = useQuery<DummyContent>(GET_DUMMY, { client });

  if (loading) return <div>'loading...'</div>;
  if (error) return <div>Error! ${error.message}</div>;

  return (
    <div className="App">
      { data && data.dummyContents.map((d, idx) => <p key={idx}>{d.id}</p>)}
    </div>
  );
}

export default App;
