import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Comment } from 'semantic-ui-react'

import Messages from '../components/Messages';
import MessageItem from '../components/MessageItem';
import {
    directMessagesQuery,
    newDirectMessageSubscription
} from '../graphql/message';

class DirectMessageContainer extends Component {
    componentWillMount() {
        this.unsubscribe = this.subscribe(this.props.teamId, this.props.userId);
    }

    componentWillReceiveProps({ teamId, userId }) {
        if (this.props.teamId !== teamId || this.props.userId !== userId) {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            this.unsubscribe = this.subscribe(teamId, userId );
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    subscribe = (teamId, userId) => this.props.data.subscribeToMore({
        document: newDirectMessageSubscription,
        variables: {
            teamId, userId
        },
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
                return prev;
            }
            return {
                ...prev,
                directMessages: [...prev.directMessages, subscriptionData.data.newDirectMessage],
            };
        },
    });

    render() {
        const { teamId, data: { loading, directMessages } } = this.props;
        if(loading) {
            return <div>loading...</div>
        }
        return (
            <Messages>
                <Comment.Group>
                    {directMessages.map((msg, i) =>
                        <Comment key={`${msg.id}-direct-message`} >
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
    options: props => ({
        teamId: props.teamId,
        userId: props.userId,
        options: {
            fetchPolicy: 'network-only'
        }
    }),
})(DirectMessageContainer);