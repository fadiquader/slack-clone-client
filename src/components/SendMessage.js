import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  padding: 10px;
`;

const ENTER_KEY = 13;

const SendMessage = (props) => {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        placeholder
    } = props;
    return (
        <SendMessageWrapper>
            <Input
                fluid name="message"
                value={values.message}
                placeholder={`Message #${placeholder}`}
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



const SendMessageWithFormik = withFormik({
    mapPropsToValues: props => ({ message: '' }),
    validate: (values, props) => {
        const errors = {};
        // values.name
        return errors
    },
    handleSubmit: async (values, {
        props: { onSubmit, channelId, mutate },
        setSubmitting, setErrors,
        resetForm
    }) => {
        if(!values.message || !values.message.trim()) {
            setSubmitting(false);
            return;
        }
        await onSubmit(values.message);
        setSubmitting(false);
        resetForm();
    }
})(SendMessage);
export default SendMessageWithFormik