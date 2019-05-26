import React, { Component } from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../firebase";

class UserPanel extends Component {
  state = {
    user: this.props.currentUser
  };
  dropdownOptions = () => [
    {
      key: "User",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "Avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "singout",

      text: <span>Sign Out</span>,
      onClick: this.handleSignOut
    }
  ];

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {

      });
  };
  render() {
    const {currentUser, primaryColor} = this.props;

    return (
      <Grid style={{ background: primaryColor}}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2rem", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              DevChat
            </Header>
          </Grid.Row>
          {/* USer Dropdown */}
          <Header inverted style={{ padding: ".25rem" }} as="h4">
            <Dropdown
              trigger={
                <span>
                  <Image src={currentUser.photoURL} spaced="right" avatar />
                  {currentUser.displayName}
                </span>
              }
              options={this.dropdownOptions()}
            />
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
