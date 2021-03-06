import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';
class SidePanel extends Component {
  state = {
    activeChannel: ''
  }
  setActiveChannel = (channel) => { channel&&this.setState({ activeChannel: channel }) };

  render() {
    const {currentUser, primaryColor} = this.props;
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: primaryColor, fontSize: "1.2rem" }}
      >
        <UserPanel currentUser={currentUser}
          primaryColor ={primaryColor}
        />
        <Starred activeChannel={this.state.activeChannel}
          setActiveChannel={this.setActiveChannel}
        />
        <Channels currentUser={currentUser}
          setActiveChannel={this.setActiveChannel}
          activeChannel = {this.state.activeChannel}
          />
        <DirectMessages currentUser={currentUser}
           setActiveChannel={this.setActiveChannel}
           activeChannel = {this.state.activeChannel}
        />
      </Menu>
    );
  }
}

export default SidePanel;
