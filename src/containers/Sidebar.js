import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';

class Sidebar extends Component {

    state = {
        openAddChannelModal: false
    };

    handleOpenAddChannelClick = () => {
        this.setState({ openAddChannelModal: true })
    };
    handleCloseAddChannelClick = () => {
        this.setState({ openAddChannelModal: false })
    };
    render () {
        const { data: { loading, allTeams }, currentTeamId } = this.props;
        if(loading) {
            return 'loading...'
        }
        const teamIdx = currentTeamId ? _.findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
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
                onAddChannelClick={this.handleOpenAddChannelClick}
            />,
            <AddChannelModal
                key="sidebar-add-channel-modal"
                teamId={currentTeamId}
                onClose={this.handleCloseAddChannelClick}
                open={this.state.openAddChannelModal}
            />
        ]
    };
}

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
