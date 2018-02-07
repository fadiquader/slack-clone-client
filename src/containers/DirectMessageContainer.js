import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Comment } from 'semantic-ui-react'

import Messages from '../components/Messages';
import MessageItem from '../components/MessageItem';
import { directMessagesQuery } from '../graphql/message';

class DirectMessageContainer extends Component {
    // componentWillMount() {
    //     this.unsubscribe = this.subscribe(this.props.channelId);
    // }
    // testFunc = () => {
    //     console.log('test func')
    // }
    // componentWillReceiveProps({ channelId }) {
    //     if (this.props.channelId !== channelId) {
    //         if (this.unsubscribe) {
    //             this.unsubscribe();
    //         }
    //         this.unsubscribe = this.subscribe(channelId);
    //     }
    // }
    //
    // componentWillUnmount() {
    //     if (this.unsubscribe) {
    //         this.unsubscribe();
    //     }
    // }
    //
    // subscribe = channelId => this.props.data.subscribeToMore({
    //     document: newChannelMessageSubscription,
    //     variables: { channelId },
    //     updateQuery: (prev, { subscriptionData }) => {
    //         if (!subscriptionData.data) {
    //             return prev;
    //         }
    //         return {
    //             ...prev,
    //             messages: [...prev.messages, subscriptionData.data.newChannelMessage],
    //         };
    //     },
    // });

    render() {
        const { teamId, data: { loading, directMessages } } = this.props;
        if(loading) {
            return <div>loading...</div>
        }
        return (
            <Messages>
                <Comment.Group>
                    {directMessages.map(msg =>
                        <Comment ey={`direct-message-${msg.id}-${teamId}`} >
                            {/*<Comment.Avatar src='/assets/images/avatar/small/matt.jpg' />*/}
                            <Comment.Content>
                                <Comment.Author as='a'>{msg.sender.username}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{msg.created_at}</div>
                                </Comment.Metadata>
                                <Comment.Text>{msg.text}</Comment.Text>
                                <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                            </Comment.Content>
                        </Comment>
                    )}
                </Comment.Group>
            </Messages>
        )
    }
}

export default graphql(directMessagesQuery, {
    variables: props => ({
        teamId: props.teamId,
        userId: props.userId,
        options: {
            fetchPolicy: 'network-only'
        }
    })
})(DirectMessageContainer);