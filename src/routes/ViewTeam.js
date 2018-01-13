import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';

const ViewTeam = (props) => {
    const { match: { params }, data: { loading, allTeams } } = props;
    if(loading) return null;
    const { teamId, channelId } = params;
    const teamIdx = !!teamId ? findIndex(allTeams, ['id', parseInt(teamId, 10)]) : 0;
    const team = allTeams[teamIdx];
    const channelIdx = !!channelId ? findIndex(team.channels, ['id', parseInt(channelId, 10)]) : 0;
    const channel = team.channels[channelIdx];
    const teams = allTeams.map(({ id, name }) => ({
        id, letter: name.charAt(0).toUpperCase()
    }));
    return (
        <AppLayout>
            <Sidebar teams={teams} team={team} currentTeamId={teamId|| 0 } />
            <Header channelName={channel.name} />
            <Messages channelId={channel.id}>
                <ul className="message-list">
                    <li />
                    <li />
                </ul>
            </Messages>
            <SendMessage channelName={channel.name}/>
        </AppLayout>
    )
};

export default graphql(allTeamsQuery)(ViewTeam);