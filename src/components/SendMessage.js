import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  padding: 10px;
`;

const ENTER_KEY = 13
const SendMessage = (props) => {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        channelName
    } = props;
    return (
        <SendMessageWrapper>
            <Input
                fluid name="message"
                value={values.message}
                placeholder={`Message #${channelName}`}
                onChange={handleChange}
                onKeyDown={e => {
                    if(e.keyCode === ENTER_KEY && !isSubmitting) {
                        handleSubmit(e)
                    }
                }}
            />
        </SendMessageWrapper>
    )
};

const createMessageMutation = gql`
mutation($channelId: Int!, $text: String!){
  createMessage(channelId: $channelId, text: $text)
}
`;

const SendMessageWithFormik = compose(
    graphql(createMessageMutation),
    withFormik({
        mapPropsToValues: props => ({ message: '' }),
        validate: (values, props) => {
            const errors = {};
            // values.name
            return errors
        },
        handleSubmit: async (values, {
            props: { channelId, mutate },
            setSubmitting, setErrors,
            resetForm
        }) => {
            if(!values.message || !values.message.trim()) {
                setSubmitting(false);
                return;
            }
            const response = await mutate({
                variables: {channelId, text: values.message},

            });
            setSubmitting(false);
            resetForm();
        }
    })
)(SendMessage);
export default SendMessageWithFormik