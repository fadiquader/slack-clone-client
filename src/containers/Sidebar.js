import React, { Component } from 'react';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';

class Sidebar extends Component {

    state = {
        openAddChannelModal: false,
        invitePeopleModal: false
    };

    handleOpenAddChannelClick = () => {
        this.setState({ openAddChannelModal: true })
    };

    handleCloseAddChannelClick = () => {
        this.setState({ openAddChannelModal: false })
    };

    handleInvitePeopleClick = (e) => {
        e && e.preventDefault();
        this.setState({ invitePeopleModal: true })
    };

    handleCloseInvitePeopleClick = (e) => {
        e && e.preventDefault();
        this.setState({ invitePeopleModal: false })
    };

    render () {
        const { teams, team, username } = this.props;
        const { openAddChannelModal, invitePeopleModal } = this.state;
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
                isOwner={team.admin}
                channels={team.channels}
                users={[]}
                onAddChannelClick={this.handleOpenAddChannelClick}
                onInvitePeopleClick={this.handleInvitePeopleClick}
            />,
            <AddChannelModal
                key="sidebar-add-channel-modal"
                teamId={team.id}
                onClose={this.handleCloseAddChannelClick}
                open={openAddChannelModal}
            /> ,
            <InvitePeopleModal
                key="sidebar-invite-people-modal"
                teamId={team.id}
                onClose={this.handleCloseInvitePeopleClick}
                open={invitePeopleModal}
            />
        ]
    };
}

export default Sidebar;
