import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react'

import Messages from '../components/Messages';

const MessageItem = ({ message }) => (
    <Comment>
        {/*<Comment.Avatar src='/assets/images/avatar/small/matt.jpg' />*/}
        <Comment.Content>
            <Comment.Author as='a'>{message.user.username}</Comment.Author>
            <Comment.Metadata>
                <div>{message.created_at}</div>
            </Comment.Metadata>
            <Comment.Text>{message.text}</Comment.Text>
            <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
        </Comment.Content>
    </Comment>
)

const MessageContainer = (props)=> {
    const { channelId, data: { loading, messages } } = props;
    if(loading) {
        return <div>loading...</div>
    }
    return (
        <Messages channelId={channelId}>
            <Comment.Group>
                {messages.map(msg => <MessageItem key={`message-${msg.id}`} message={msg} />)}
            </Comment.Group>
        </Messages>
    )
};

const messagesQuery = gql`
query ($channelId: Int!) {
  messages(channelId: $channelId) {
     id
      text
      user {
        username
      }
      created_at
  }
}
`;
export default graphql(messagesQuery, {
    variables: props => ({
        channelId: props.channelId,
    })
})(MessageContainer);