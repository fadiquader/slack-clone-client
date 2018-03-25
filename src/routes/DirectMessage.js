import React from 'react';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import DirectMessageContainer from '../containers/DirectMessageContainer';

import { meQuery } from '../graphql/team';

const DirectMessage = (props) => {
    const { mutate, match: { params }, data: { loading, me, getUser } } = props;
    if(loading) return null;
    // const teams = [...allTeams, ...inviteTeams];
    const { teams, username } = me;
    if(!teams.length) {
        return (
            <div>
                No Teams Found! <Link to={`/create-team`}>Create a Team</Link>
            </div>
        )
    }
    const { teamId, userId } = params;
    const teamIdInt = parseInt(teamId || 0, 10);
    if(isNaN(teamIdInt)) {
        return (
            <div>
                Invalid parameters, <Link to={`/view-team`}>Go back</Link>
            </div>
        )
    }
    const teamIdx = !!teamId ? findIndex(teams, ['id', parseInt(teamIdInt, 10)]) : 0;
    const team = teams[teamIdx];

    const teamsTh = teams.map(({ id, name }) => ({
        id, letter: name.charAt(0).toUpperCase()
    }));
    return (
        <AppLayout>
            <Sidebar teams={teamsTh} team={team} username={username}
                     currentTeamId={teamId|| 0 } />
            <Header channelName={getUser.username} />
            <DirectMessageContainer teamId={teamId} userId={userId} />
            <SendMessage onSubmit={async text => {
                await mutate({
                    variables: {
                        text,
                        receiverId: userId,
                        teamId
                    },
                    optimisticResponse: true,
                    update: store => {
                        const data = store.readQuery({ query: meQuery })
                        const teamIdx2 = findIndex(data.me.teams, ['id', team.id])
                        const notAlreadyThere = data.me.teams[teamIdx2].directMessageMembers.every(member => member.id !== parseInt(userId, 10))
                        if(!notAlreadyThere) return;
                        data.me.teams[teamIdx2].directMessageMembers.push({
                            __typename: 'User',
                            id: userId,
                            username: getUser.username,
                        })
                        store.writeQuery({ query: meQuery, data })
                    }
                })
            }} placeholder={userId} />
        </AppLayout>
    )
};

const directMessageMeQuery = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

const createDirectMessageMutation = gql`
mutation ($receiverId: Int!, $text: String!, $teamId: Int!) {
  createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
}
`;

const DirectMessageWithGraph = compose(
    // graphql(meQuery, { options: { fetchPolicy: 'network-only' }}),
    graphql(directMessageMeQuery, {
        options: props => ({
            variables: { userId: props.match.params.userId },
            fetchPolicy: 'network-only',
        }),
    }),
    graphql(createDirectMessageMutation),

)(DirectMessage)
export default DirectMessageWithGraph;