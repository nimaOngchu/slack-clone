// eslint-disable-next-line jsx-a11y/href-no-hash
import React, { Component } from "react";
import md5 from "md5";
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
export class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    userRef: firebase.database().ref("users")
  };

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all the field" };
      this.setState({
        errors: errors.concat(error)
      });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password not valid" };
      this.setState({
        errors: errors.concat(error)
      });
    } else {
      //form valid
      return true;
    }
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.lenght < 6 || passwordConfirmation.lenght < 6) {
      console.log("password too short");
      return false;
    } else if (password !== passwordConfirmation) {
      console.log("password donont match");
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !password.length ||
      !email.length ||
      !passwordConfirmation.length
    );
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
    if (this.isFormValid()) {
      this.setState({
        errors: [],
        loading: true
      });

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUSer => {
          console.log(createdUSer);
          // this.setState({ loading: false });
          createdUSer.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUSer.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUSer).then(() => {
                this.setState({
                  loading: false
                })
                console.log('user saved');
              })
            })
            .catch(err => {
              console.err(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  saveUser = (createdUser) => {
    return this.state.userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  handleInputErrors = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large" autoComplete="off">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                type="text"
                value={username}
                className={this.handleInputErrors(errors, "username")}
              />
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
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="lock"
                iconPosition="left"
                placeholder="Passowrd Confirmation"
                onChange={this.handleChange}
                type="password"
                value={passwordConfirmation}
                className={this.handleInputErrors(errors, "password")}
              />
              <Button
                disabled={loading}
                color="orange"
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
            Already a User ?<Link to="/login"> Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
