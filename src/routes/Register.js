import React, { Component } from 'react';
import {graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
    Form,
    Message,
    Input, Button,
    Container, Header
} from 'semantic-ui-react'

const initialState = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: ''
};

const FormField = Form.Field;

class Register extends Component {
    state = {
        ...initialState
    };

    onChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value })
    };

    onSubmit = async e => {
        this.setState({ usernameError: '', emailError: '', passwordError: ''});
        const response = await this.props.mutate({
            variables: this.state
        });
        const { ok, errors } = response.data.register;
        if(ok){
            this.props.history.push('/')
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.setState(err)
        }
    };

    render() {
        const { usernameError, emailError, passwordError } = this.state;
        const errorsList = [];
        if(usernameError) errorsList.push(usernameError);
        else if(emailError) errorsList.push(emailError);
        else if(passwordError) errorsList.push(passwordError);
        return (
            <Container text>
                <Header as="h2">Register</Header>
                <Form>
                    <FormField error={!!usernameError}>
                        <Input onChange={this.onChange}
                               fluid placeholder="username"
                               name="username"
                        />
                    </FormField>
                    <FormField error={!!emailError} >
                        <Input onChange={this.onChange}
                               fluid placeholder="email"
                               name="email"
                        />
                    </FormField>
                    <FormField error={!!passwordError}>
                        <Input onChange={this.onChange}
                               fluid placeholder="password"
                               type="password" name="password"
                        />
                    </FormField>
                    <Button onClick={this.onSubmit}>Submit</Button>
                </Form>
                {errorsList.length ? <Message
                    error
                    header="there was an error in submission"
                    list={errorsList}
                />: null}
            </Container>
        );
    }
}

const registerMutaion = gql`
mutation($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password){
    ok
    errors {
        path
        message
    }
  }
}
`;
export default graphql(registerMutaion)(Register);