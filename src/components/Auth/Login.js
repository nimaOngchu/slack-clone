// eslint-disable-next-line jsx-a11y/href-no-hash
import React, { Component } from "react";
import {
  Grid,
  Form,
  Button,
  Message,
  Header,
  Segment,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
export class Login extends Component {
  state = {

    email: "",
    password: "",

    errors: [],
    loading: false,

  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedInUser) => {
          console.log(signedInUser);
    
        }).catch((err) => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
      })
    }
  };

  isFormValid = ({ email, password }) => email && password ;

  handleInputErrors = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  render() {
    const {
      email,
      password,
      errors,
      loading
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="blue" textAlign="center">
            <Icon name="code branch" color="blue" />
            Login for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large" autoComplete="off">
            <Segment stacked>

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.handleInputErrors(errors, "email")}
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Confirm Passowrd"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.handleInputErrors(errors, "password")}
              />

              <Button
                disabled={loading}
                color="blue"
                fluid
                size="large"
                className={loading ? "loading" : ""}
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Don't have an account <Link to="/register"> Register </Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
