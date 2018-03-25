import React, { Component } from 'react';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import DirectMessageModal from '../components/DirectMessageModal';

class Sidebar extends Component {

    state = {
        openAddChannelModal: false,
        invitePeopleModal: false,
        openDirectMessageModal: false,
    };

    toggleDirectMessageModal = (e) => {
        if(e) e.preventDefault();
        this.setState(prev => ({ openDirectMessageModal: !prev.openDirectMessageModal }))
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
        const { openAddChannelModal, invitePeopleModal, openDirectMessageModal } = this.state;

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
                users={team.directMessageMembers}
                onAddChannelClick={this.handleOpenAddChannelClick}
                onInvitePeopleClick={this.handleInvitePeopleClick}
                onDirectMessageClick={this.toggleDirectMessageModal}
            />,
            <DirectMessageModal
                key="sidebar-add-direct-message-modal"
                teamId={team.id}
                onClose={this.toggleDirectMessageModal}
                open={openDirectMessageModal}
            /> ,
            <AddChannelModal
                key="sidebar-add-channel-modal"
                teamId={team.id}
                onClose={this.toggleDirectMessageModal}
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
