import React from 'react';
import { ApolloClient } from 'apollo-client';
import { HttpLink, createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import 'semantic-ui-css/semantic.min.css';
import Routes from './routes';

const httpLink = createHttpLink({ uri: 'http://localhost:3001/graphql' });

const authMiddleware = setContext((_, { headers }) => ({
    headers: {
        'x-token': localStorage.getItem('token'),
        'x-refresh-token': localStorage.getItem('refreshToken'),
    },
}));

const afterwareLink = new ApolloLink((operation, forward) => {
    const { headers } = operation.getContext();

    if (headers) {
        const token = headers.get('x-token');
        const refreshToken = headers.get('x-refresh-token');

        if (token) {
            localStorage.setItem('token', token);
        }

        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    }

    return forward(operation);
});

const link = afterwareLink.concat(authMiddleware.concat(httpLink));


const client = new ApolloClient({
    // By default, this client will send queries to the
    //  `/graphql` endpoint on the same host
    link,
    // link: new HttpLink(),
    cache: new InMemoryCache()
});
const App = () => {
    return (
        <ApolloProvider client={client}>
            <Routes />
        </ApolloProvider>
    );
}

export default App;
