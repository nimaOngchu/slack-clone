import React, { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";
import Message from "./Message";
class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessageRef: firebase.database().ref('privateMessages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numUniqueUsers: 0,
    scrollHeight: 0,
    searchLoading: false,
    searchResults: [],
    searchTerm: '',
    isPrivateChannel: this.props.isPrivateChannel,
    isChannelStarred: false,
    userRef: firebase.database().ref('users').child(`${this.props.currentUser.uid}`)
  };
  componentDidMount() {
    const { channel, user } = this.state;
    if (channel && user) {
      this.addListners(channel.id);
      this.addUserStarListner(channel.id)
    }
  }

  componentWillUnmount() {
    this.removeListner();
  }
  getMessageRef = () =>
  {
    return this.state.isPrivateChannel
      ? this.state.privateMessageRef
      : this.state.messagesRef
  }
  handleStar = () => {
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred
    }), () => this.starChannel())
  }

  addUserStarListner = (channel) => {
    const ref = this.state.userRef.child('starred');
    ref.once('value').then(data => {
      if (data.val() != null) {
        const starredChannelIds = Object.keys(data.val());
        const prevStarred = starredChannelIds.includes(channel);
        this.setState({ isChannelStarred: prevStarred})
      }
    })
  }

  starChannel = () => {
    const ref = this.state.userRef.child('starred');
    if (this.state.isChannelStarred) {
      ref.child(`${this.state.channel.id}`).set({
        name: this.state.channel.name,
        details: this.state.channel.details,
        createdBy: {
          name: this.state.channel.createdBy.name,
          avatar:this.state.channel.createdBy.avatar
        }
      })
    } else {
      ref.child(`${this.state.channel.id}`).remove(err => {
        if (err != null) {
          console.log(err);
        }
      });
    }
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
    this.setState({ searchResults: searchResults });
    setTimeout(() => this.setState({searchLoading: false}), 1000)

  }
  removeListner = () => {
    this.getMessageRef().off();
  };
  addListners = channel => {
    let loadedMessages = [];

      this.getMessageRef().child(channel).on('child_added', snap => {

        loadedMessages.push(snap.val());
        this.setState({
          messages: loadedMessages,
          messagesLoading: false
        });
        this.countUniqueUsers(loadedMessages);
        this.scrollToBottom();
        this.countUserPosts(loadedMessages);
      });

  };

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;

      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count:1
        }
      }
      return acc;
    }, {})
    this.props.setUserPosts(userPosts);
  }

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

    const {
       channel, user, messages,
      numUniqueUsers, searchTerm, searchResults,
      searchLoading, isPrivateChannel, isChannelStarred } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
          isPrivateChannel = {isPrivateChannel}
          currentChannel={channel}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isChannelStarred={isChannelStarred}
          handleStar = { this.handleStar }
        />
        <Segment>
          <Comment.Group className="messages" id='messagesRoom'>
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={this.getMessageRef}
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel = {isPrivateChannel}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
