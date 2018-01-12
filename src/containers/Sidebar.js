import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import Channels from '../components/Channels';
import Teams from '../components/Teams';

const Sidebar = (props) => {
    const { data: { loading, allTeams }, currentTeamId } = props;
    if(loading) {
        return 'loading...'
    }
    const teamIdx = _.findIndex(allTeams, ['id', currentTeamId]);
    const team = allTeams[teamIdx];
    const teams = allTeams.map(({ id, name }) => ({
        id, letter: name.charAt(0).toUpperCase()
    }));
    return [
        <Teams
            key="sidebar-teams"
            teams={teams}
        />,
        <Channels
            key="sidebar-channels"
            teamName={team.name}
            username="fadiqua"
            channels={team.channels}
            users={[]}
        />
    ]
};

const allTeamsQuery = gql`
{
  allTeams {
    id
    name
    channels {
      id
      name
    }
  }
}
`;
export default graphql(allTeamsQuery)(Sidebar);
