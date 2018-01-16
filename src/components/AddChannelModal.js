import React from 'react';
import { Button, Form, Input, Modal } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';

import { meQuery } from '../graphql/team';

const AddChannelModal = (props) => {
    const {
        open,
        onClose,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
    } = props;
    return (
        <Modal open={open} onClose={!isSubmitting ? onClose : null} >
            <Modal.Header>Add a channel</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <Input fluid
                               value={values.name}
                               onChange={handleChange}
                               name="name"
                               placeholder="Add a channel"
                               onBlur={handleBlur}
                               disabled={isSubmitting}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Button
                            color='green'
                            onClick={handleSubmit}
                            loading={isSubmitting}
                        >
                            Create A Channel
                        </Button>
                        <Button disabled={isSubmitting} color='red' onClick={onClose}>
                            Cancel
                        </Button>
                    </Form.Field>
                </Form>
            </Modal.Content>
        </Modal>
    )
};

const createChannelMutaion = gql`
mutation createChannel($teamId: Int!, $name: String!) {
  createChannel(teamId: $teamId, name: $name) {
    ok
    channel {
        id
        name
    }
  }
}
`;
const AddChannelModalWithForm = compose(
    graphql(createChannelMutaion),
    withFormik({
        mapPropsToValues: props => ({ name: '' }),
        validate: (values, props) => {
            const errors = {};
            // values.name
            return errors
        },
        handleSubmit: async (values, {
            props: { teamId, onClose, mutate },
            setSubmitting, setErrors,
            resetForm
        }) => {
            setSubmitting(true);
            const response = await mutate({
                variables: { teamId, name: values.name },
                optimisticResponse: {
                    __typename: 'Mutation',
                    createChannel: {
                        __typename: "ChannelResponse",
                        ok: true,
                        channel: {
                            __typename: 'Channel',
                            id: -1,
                            name: values.name,
                        },
                    }
                },
                update: (store, { data: { createChannel } }) => {
                    const { ok, channel } = createChannel;
                    if(!ok) return;
                    const data = store.readQuery({ query: meQuery });
                    const teamIdx = findIndex(data.me.teams, ['id', parseInt(teamId, 10)]);
                    data.me.teams[teamIdx].channels.push(channel)
                    store.writeQuery({ query: meQuery, data })
                }
            });
            onClose();
            setSubmitting(false);
            resetForm();

        }
    })
)(AddChannelModal);

export default AddChannelModalWithForm