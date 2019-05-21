import React from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
class Channels extends React.Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    channels: [],
    channelName: "",
    channelDetail: "",
    modal: false,
    channelsRef: firebase.database().ref("channels"),
    firstLoad: true
  };
  componentDidMount() {
    this.addListners();
    }

  componentWillUnmount() {
    this.removeListners();
    }

    removeListners = () => {
        this.state.channelsRef.off();
    }

  addListners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };
  setFirstChannel = () => {
    if (this.state.channels.length > 0 && this.state.firstLoad) {
      this.changeChannel(this.state.channels[0]);
    }
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetail, user } = this.state;
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetail,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelNAme: "", channelDetail: "" });
        this.closeModal();
        console.log("channel Added");
      });
  };

  displayChannels = channels =>
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        style={{ opacity: 0.7 }}
        onClick={() => this.changeChannel(channel)}
        active={channel.id === this.state.activeChannel}
      >
        #{" " + channel.name}
      </Menu.Item>
    ));

  changeChannel = channel => {
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ firstLoad: false, activeChannel: channel.id });
  };
  closeModal = () => this.setState({ modal: false });

  openModal = () => this.setState({ modal: true });

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormValid = ({ channelName, channelDetail }) =>
    channelName && channelDetail;

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className ='menu'>
          <Menu.Item>
            <span>
              <Icon name="exchange" />
              CHANNELS
            </span>
            <span> </span>({channels.length})
            <Icon
              name="add"
              onClick={this.openModal}
              style={{ cursor: "pointer" }}
            />
          </Menu.Item>

          {this.displayChannels(channels)}
        </Menu.Menu>

        {/* Add channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetail"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" />
              Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(Channels);
