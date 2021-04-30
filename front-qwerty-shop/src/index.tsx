import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';
import { onError } from '@apollo/client/link/error';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import './index.scss';
import './fonts/Lato-Regular.ttf';

const getToken = () => {
  return localStorage.getItem('token');
};

const setupApollo = async () => {
  const apiBaseUrl = process.env.NODE_ENV === "production" ? 'https://qwerty-shop-back.herokuapp.com' : 'http://localhost:8080';
  const cache = new InMemoryCache({
    addTypename: true,
    typePolicies: {
      AuthToken: {
        keyFields: () => 'token',
        merge: true,
      },
      User: {
        keyFields: () => 'userInfo',
        merge: true,
      },
      ItemType: {
        keyFields: (data) => {
          return `Product:${data.type}`
        },
        merge: true
      },
      SingleItemType: {
        keyFields: (data: any) => {
          return `Item:${data['item']._id}`
        },
        merge: true,
      },
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message }) => {
        // console.log(
        //   `[GraphQL error]: Message: ${message}`,
        // )

        if (message === 'Invalid token' || message === 'Forbidden resource') {
          localStorage.removeItem('token');
        }
      });
    }

    if (networkError) {
      // console.log(`[Network error]: ${networkError}`);
    }
  });

  const httpLink = createHttpLink({
    uri: `${apiBaseUrl}/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: getToken() ? `Bearer ${getToken()}` : "",
      }
    }
  });

  await persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });

  const apolloClient = new ApolloClient({
    cache,
    link: ApolloLink.from([authLink, errorLink, httpLink]),
  });

  return apolloClient;
};

(async () => {
  let apolloClient = await setupApollo();

  ReactDOM.render(
    <Router>
      <ApolloProvider client={apolloClient} >
        <App client={apolloClient} />
      </ApolloProvider>
    </Router>,
    document.getElementById('qwerty-shop-root'),
  );
})();