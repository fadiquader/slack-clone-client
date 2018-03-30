import gql from 'graphql-tag';

export const messagesQuery = gql`
query ($channelId: Int!) {
  messages(channelId: $channelId) {
     id
      text
      user {
        username
      }
      url
      filetype
      created_at
  }
}
`;
export const newChannelMessageSubscription = gql`
subscription($channelId: Int!) {
  newChannelMessage(channelId: $channelId) {
    id
    text
    user {
      username
    }
    created_at
  }
}
`;

export const directMessagesQuery = gql`
query($offset: Int!, $teamId: Int!, $userId: Int!) {
  directMessages(offset:$offset, teamId: $teamId, otherUserId: $userId) {
    id
    sender {
      username
    }
    text
    created_at
  }
}
`;

export const newDirectMessageSubscription = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;
