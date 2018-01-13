import React, { Component } from 'react';
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
        const { teams, team } = this.props;
        return [
            <Teams
                key="sidebar-teams"
                teams={teams}
            />,
            <Channels
                key="sidebar-channels"
                teamName={team.name}
                username="fadiqua"
                teamId={team.id}
                channels={team.channels}
                users={[]}
                onAddChannelClick={this.handleOpenAddChannelClick}
            />,
            <AddChannelModal
                key="sidebar-add-channel-modal"
                teamId={team.id}
                onClose={this.handleCloseAddChannelClick}
                open={this.state.openAddChannelModal}
            />
        ]
    };
}

export default Sidebar;
