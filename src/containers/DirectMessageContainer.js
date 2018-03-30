import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Comment, Button } from 'semantic-ui-react'

import Messages from '../components/Messages';
import MessageItem from '../components/MessageItem';
import {
    directMessagesQuery,
    newDirectMessageSubscription
} from '../graphql/message';

class DirectMessageContainer extends Component {
    state = {
        hasMoreItems: true
    }
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
                directMessages: [subscriptionData.data.newDirectMessage, ...prev.directMessages,],
            };
        },
    });

    render() {
        const { teamId, userId, data: { loading, directMessages } } = this.props;
        const { hasMoreItems } = this.state;
        if(loading) {
            return <div>loading...</div>
        }
        return (
            <Messages>
                <Comment.Group>
                    {
                        hasMoreItems &&
                        <Button onClick={() => this.props.data.fetchMore({
                            variables: {
                                teamId, userId,
                                offset: directMessages.length
                            },
                            updateQuery: (previousResult, { fetchMoreResult }) => {
                                if (!fetchMoreResult) {
                                    return previousResult;
                                }

                                if (fetchMoreResult.directMessages.length < 10) {
                                    this.setState({ hasMoreItems: false });
                                }

                                return {
                                    ...previousResult,
                                    directMessages: [
                                        ...previousResult.directMessages,
                                        ...fetchMoreResult.directMessages
                                    ],
                                };
                            },
                        })}>
                            Load More
                        </Button>
                    }

                    {directMessages.slice().reverse().map((msg, i) =>
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
        options: {
            fetchPolicy: 'network-only'
        },
        variables: {
            offset: 0,
            teamId: props.teamId,
            userId: props.userId,
        }
    }),
})(DirectMessageContainer);