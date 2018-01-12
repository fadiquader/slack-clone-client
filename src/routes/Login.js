import React, { Component } from 'react';
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react';
import {graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
    Form,
    Message,
    Input, Button,
    Container, Header
} from 'semantic-ui-react';

const FormField = Form.Field;

class Login extends Component {
    constructor(props) {
        super(props);
        extendObservable(this, {
            email: '',
            password: '',
            errors: {}
        })
    }
    onChange = e => {
        const { name, value } = e.target;
        this[name] = value;
    };

    onSubmit = async e => {
        this.errors = {};
        const { email, password } = this;
        const response = await this.props.mutate({
            variables: { email, password }
        });
        const { ok, token, refreshToken, errors } = response.data.login;
        if(ok) {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            this.props.history.push('/')
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.errors = err;
        }
    };
    render() {
        const { email, password, errors: { emailError, passwordError } } = this;
        const errorsList = [];
        if(emailError) errorsList.push(emailError);
        else if(passwordError) errorsList.push(passwordError);
        return (
            <Container text>
                <Header as="h2">Login</Header>
                <Form>
                    <FormField error={!!emailError}>
                        <Input
                               onChange={this.onChange}
                               fluid placeholder="email"
                               name="email"
                               value={email}
                        />
                    </FormField>
                    <FormField error={!!passwordError}>
                        <Input onChange={this.onChange}
                               fluid placeholder="password"
                               type="password" name="password"
                               value={password}
                        />
                    </FormField>
                    <Button onClick={this.onSubmit}>Submit</Button>
                </Form>
                {errorsList.length ? <Message
                    error
                    header="there was an error in submission"
                    list={[]}
                />: null}
            </Container>
        )
    }
}
const loginMutaion = gql`
mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    ok
    token
    refreshToken
    errors {
      path
      message
    }
  }
}
`;
export default graphql(loginMutaion)(observer(Login));