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
    messagesLoading: true,
    numUniqueUsers: 0,
    scrollHeight: 0,
    searchLoading: false,
    searchResults: [],
    searchTerm:''
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
  scrollToBottom = () => {
    let messagesRoom = document.getElementById('messagesRoom');

    messagesRoom.scrollTop = messagesRoom.scrollHeight;

  }
  handleSearchChange = (e) => {

    this.setState({
      searchTerm: e.target.value,
      searchLoading: true
    }, () => {this.filterSearchMessages();})
  }

  filterSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages
      .reduce((acc, message) => {
        if (message.content && message.content.match(regex ) || message.user.name.match(regex)) {
          acc.push(message);
        }
        return acc
      }, []);
    this.setState({ searchResults: searchResults })

  }
  removeListner = () => {
    this.state.messagesRef.off();
  };
  addListners = channel => {
    let loadedMessages = [];

      this.state.messagesRef.child(channel).on('child_added', snap => {

        loadedMessages.push(snap.val());
        this.setState({
          messages: loadedMessages,
          messagesLoading: false
        });
        this.countUniqueUsers(loadedMessages);
        this.scrollToBottom();
      });

  };

  countUniqueUsers = (message) => {
    const uniqueUsers = message.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, [])
    const plulral = uniqueUsers.length > 1 || uniqueUsers.lenght === 0;
    const numUniqueUsers = `${uniqueUsers.length +' ' }user${plulral ? 's' : ''}`;
    this.setState({numUniqueUsers})
  }
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

    const { messagesRef, channel, user, messages, numUniqueUsers, searchLoading, searchResults } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
          currentChannel={channel}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
        />
        <Segment>
          <Comment.Group className="messages" id='messagesRoom'>
            {searchLoading ? this.displayMessages(searchResults) : this.displayMessages(messages)}
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
