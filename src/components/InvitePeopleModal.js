// npm packages
import React from 'react';
import { Button, Form, Input, Modal } from 'semantic-ui-react'
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
// local imports
import { normalizeError } from '../utils';

const InvitePeopleModal = (props) => {
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
            <Modal.Header>Invite People to your Team</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field error={!!errors.email}>
                        <Input fluid
                               value={values.name}
                               onChange={handleChange}
                               name="email"
                               placeholder="Insert User Email..."
                               onBlur={handleBlur}
                               disabled={isSubmitting}
                               type="email"
                        />
                    </Form.Field>
                    <div>
                        { touched.email && Object.keys(errors).map(k => errors[k].map((msg, i) =>
                            <p key={`error-${k}-${i}`}>{msg} <br/></p>
                        ))}
                        <br/>
                    </div>
                    <Form.Field>
                        <Button
                            color='green'
                            onClick={handleSubmit}
                            loading={isSubmitting}
                        >
                            Invite
                        </Button>
                        <Button disabled={isSubmitting} color='red' onClick={onClose}>
                            Cancel
                        </Button>
                    </Form.Field>
                </Form>
            </Modal.Content>
        </Modal>
    );
};

const addTeamMemberMutation = gql`
mutation ($email: String!, $teamId: Int!){
  addTeamMember(email: $email, teamId: $teamId) {
    ok
    errors {
      path
      message
    }
  }
}
`;

const InvitePeoplelModalWithForm = compose(
    graphql(addTeamMemberMutation),
    withFormik({
        mapPropsToValues: props => ({ email: '' }),
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
                variables: {teamId, email: values.email},
            });
            const { addTeamMember: { ok, errors }} = response.data;
            if(!ok) {
                setErrors(normalizeError(errors));
                return;
            }
            onClose();
            resetForm();
        }
    })
)(InvitePeopleModal);
export default InvitePeoplelModalWithForm;