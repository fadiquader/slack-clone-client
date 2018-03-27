import React from 'react';
import { Comment } from 'semantic-ui-react'

const MessageItem = ({ message }) => (
    <Comment>
        {/*<Comment.Avatar src='/assets/images/avatar/small/matt.jpg' />*/}
        <Comment.Content>
            <Comment.Author as='a'>{message.user.username}</Comment.Author>
            <Comment.Metadata>
                <div>{message.created_at}</div>
            </Comment.Metadata>
            {message.url ? <img src={`${message.url}`} alt="" /> : <Comment.Text>{message.text}</Comment.Text>}
            <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
        </Comment.Content>
    </Comment>
);

export default MessageItem;