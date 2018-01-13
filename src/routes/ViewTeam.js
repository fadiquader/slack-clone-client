import React from 'react';

import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';

export default (props) => {
    const { match: { params } } = props;
    return (
        <AppLayout>
            <Sidebar currentTeamId={1} />
            <Header channelName="sds" />
            <Messages>
                <ul className="message-list">
                    <li />
                    <li />
                </ul>
            </Messages>
            <SendMessage channelName={"sds"}/>
        </AppLayout>
    )
};