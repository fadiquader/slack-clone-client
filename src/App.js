import React from 'react';
import { ApolloProvider } from 'react-apollo';

import { client } from './config/apollo';
import 'semantic-ui-css/semantic.min.css';
import Routes from './routes';

const App = () => {
    return (
        <ApolloProvider client={client}>
            <Routes />
        </ApolloProvider>
    );
}

export default App;
