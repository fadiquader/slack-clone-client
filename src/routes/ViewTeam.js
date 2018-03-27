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
import MessageContainer from '../containers/MessageContainer';

import { meQuery } from '../graphql/team';

const ViewTeam = (props) => {
    const { mutate, match: { params }, data: { loading, me } } = props;
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
    const { teamId, channelId } = params;
    const teamIdInt = parseInt(teamId || 0, 10);
    const channelIdInt = parseInt(channelId || 0, 10);
    if(isNaN(teamIdInt) || isNaN(channelIdInt)) {
        return (
            <div>
                Invalid parameters, <Link to={`/view-team`}>Go back</Link>
            </div>
        )
    }
    const teamIdx = !!teamId ? findIndex(teams, ['id', parseInt(teamIdInt, 10)]) : 0;
    const team = teams[teamIdx];
    const channelIdx = !!channelId ? findIndex(team.channels, ['id', parseInt(channelIdInt, 10)]) : 0;
    const channel = team.channels[channelIdx];
    const teamsTh = teams.map(({ id, name }) => ({
        id, letter: name.charAt(0).toUpperCase()
    }));
    return (
        <AppLayout>
            <Sidebar teams={teamsTh} team={team} username={username}
                     currentTeamId={teamId|| 0 } />
            {channel && <Header channelName={channel.name} />}
            {channel && <MessageContainer channelId={channel.id} />}
            {channel &&
            <SendMessage
                channelId={channel.id}
                placeholder={channel.name}
                onSubmit={async text => {
                    await mutate({ variables: { text, channelId: channel.id }})
                }}/>
            }
        </AppLayout>
    )
};

const createMessageMutation = gql`
mutation($channelId: Int!, $text: String!){
  createMessage(channelId: $channelId, text: $text)
}
`;

export default compose(
    graphql(createMessageMutation),
    graphql(meQuery, {options: { fetchPolicy: 'network-only' }}),
)(ViewTeam);