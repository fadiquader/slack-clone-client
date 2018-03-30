import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
// subscriptions-transport-ws
import createFileLink from './createFileLink';

// const httpLink = createHttpLink({ uri: 'http://localhost:3001/graphql' });
const httpLink = createFileLink({ uri: 'http://localhost:3001/graphql' });

const authMiddleware = setContext((_, { headers }) => ({
    headers: {
        'x-token': localStorage.getItem('token'),
        'x-refresh-token': localStorage.getItem('refreshToken'),
    },
}));

const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
        const { response: { headers } } = operation.getContext();
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
        return response;
    });
});

const httpLinkWithMiddleware  = afterwareLink.concat(authMiddleware.concat(httpLink));

// Create a WebSocket link:
export const wsLink = new WebSocketLink({
    uri: 'ws://localhost:3001/subscriptions',
    lazy: true,
    options: {
        reconnect: true,
        connectionParams: {
            token: localStorage.getItem('token'),
            refreshToken: localStorage.getItem('refreshToken')
        }
    },
});


const link = split(
    // split based on operation type
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLinkWithMiddleware,
);
const client = new ApolloClient({
    // By default, this client will send queries to the
    //  `/graphql` endpoint on the same host
    link,
    cache: new InMemoryCache()
});

export { client };

//
// // using the ability to split links, you can send data to each link
// // depending on what kind of operation is being sent
