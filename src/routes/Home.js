import React from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Home = ({ data: { loading, allUsers}}) => {
    if(loading) return null;
    return (
        <div>
            { allUsers.map(user => <div key={`user_${user.id}`}>{user.username}</div>)}
        </div>
    )
};


const allUsersQuery = gql`
{
    allUsers {
        id
        username
        email
    }
}
`
export default graphql(allUsersQuery)(Home);