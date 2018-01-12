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

class CreateTeam extends Component {
    constructor(props) {
        super(props);
        extendObservable(this, {
            name: '',
            errors: {}
        })
    }
    onChange = e => {
        const { name, value } = e.target;
        this[name] = value;
    };

    onSubmit = async e => {
        // this.errors = {};
        const { name } = this;
        let response = null;
        try {
            response = await this.props.mutate({
                variables: { name }
            });
            this.props.history.push('/')
        } catch (err) {
            this.props.history.push('/login')
        }
        // const { ok, errors } = response.data.createTeam;
        // if(ok) {
        //     this.props.history.push('/')
        // } else {
        //     const err = {};
        //     errors.forEach(({ path, message }) => {
        //         err[`${path}Error`] = message;
        //     });
        //     this.errors = err;
        // }
    };
    render() {
        const { name, errors: { nameError } } = this;
        const errorsList = [];
        if(nameError) errorsList.push(nameError);
        return (
            <Container text>
                <Header as="h2">Create a Team</Header>
                <Form>
                    <FormField error={!!nameError}>
                        <Input
                            onChange={this.onChange}
                            fluid placeholder="Name"
                            name="name"
                            value={name}
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
const createTeamMutaion = gql`
mutation ($name: String!) {
  createTeam(name: $name) {
    ok
    errors {
      path
      message
    }
  }
}
`;
export default graphql(createTeamMutaion)(observer(CreateTeam));