import React, { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";
import Message from "./Message";
class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true
  };
  componentDidMount() {
    const { channel, user } = this.state;
    if (channel && user) {
      this.addListners(channel.id);
    }
  }
  componentWillUnmount() {
    this.removeListner();
  }

  removeListner = () => {
    this.state.messagesRef.off();
  };
  addListners = channel => {
    let loadedMessages = [];

    this.state.messagesRef.child(channel).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };
  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));
  render() {
    const { messagesRef, channel, user, messages } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
