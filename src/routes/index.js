import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateTeam from './CreateTeam';
import ViewTeam from './ViewTeam';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        decode(token);
        decode(refreshToken);
    } catch (err) {
        return false;
    }

    return true;
};

const PrivateRoute = ({ component: Component, inverse, ...rest }) => {
    let authenticated = isAuthenticated();
    if(inverse) authenticated = !authenticated;
    return (
        <Route
            {...rest}
            render={props =>
                (authenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: !inverse ? '/login' : '/',
                        }}
                    />
                ))}
        />
    )
};

export default () => (
    <Router>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/login" inverse={true} component={Login} />
            <Route path="/view-team/:teamId?/:channelId?" exact component={ViewTeam} />
            <PrivateRoute path="/create-team" exact component={CreateTeam} />
        </Switch>
    </Router>
)
