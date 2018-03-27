import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Comment } from 'semantic-ui-react'

import Messages from '../components/Messages';
import MessageItem from '../components/MessageItem';
import { messagesQuery, newChannelMessageSubscription } from '../graphql/message';
import FileUpload from '../components/FileUpload';

class MessageContainer extends Component {
    componentWillMount() {
        this.unsubscribe = this.subscribe(this.props.channelId);
    }

    componentWillReceiveProps({ channelId }) {
        if (this.props.channelId !== channelId) {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            this.unsubscribe = this.subscribe(channelId);
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    subscribe = channelId => this.props.data.subscribeToMore({
        document: newChannelMessageSubscription,
        variables: { channelId },
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
                return prev;
            }
            return {
                ...prev,
                messages: [...prev.messages, subscriptionData.data.newChannelMessage],
            };
        },
    });

    render() {
        const { channelId, data: { loading, messages } } = this.props;
        if(loading) {
            return <div>loading...</div>
        }
        return (
            <Messages channelId={channelId}>
                <FileUpload disableClick channelId={channelId}>
                    <Comment.Group>
                        {messages.map(msg => <MessageItem key={`message-${msg.id}-${channelId}`} message={msg} />)}
                    </Comment.Group>
                </FileUpload>
            </Messages>
        )
    }
}

export default graphql(messagesQuery, {
    variables: props => ({
        channelId: props.channelId,
        options: {
            fetchPolicy: 'network-only'
        }
    })
})(MessageContainer);