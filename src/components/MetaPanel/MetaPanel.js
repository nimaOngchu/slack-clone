import React, { Component } from 'react';
import { Header, Segment, Accordion, Icon, Image, List } from 'semantic-ui-react';

class MetaPanel extends Component {
  state = {
    activeIndex: 0,
    privateChannel: this.props.isPrivateChannel,
    channel: this.props.currentChannel
  }
  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }
formatCount = num => (num > 1 || num === 0) ? `${num } posts` : `${num } post`
  displayTopPosters = posts =>

    // Object.entries converts object into multiple arrays with keys and values
    //eg. var a = { b: 1, c: 1 } => Object.entries(a) => [[b, 1], [c, 1]]
    Object.entries(posts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
        <List.Item key={i} >
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as='a'>{key}</List.Header>
            <List.Description> {this.formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>

      )).slice(0, 5);

  render() {
    const { activeIndex, privateChannel, channel } = this.state;
    const { userPosts } = this.props;

    if (privateChannel) { return null }
    return (
      <Segment loading = {!channel}>
        <Header as='h3' attached='top'>
        About # {channel && channel.name}
        </Header>
        <Accordion styled attached='true'>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}>
            <Icon name='dropdown' />
            <Icon name='info' />
            channel Details

            </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {channel && channel.details}
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}>
            <Icon name='dropdown' />
            <Icon name='user circle' />
            Top Posters

            </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List>
            {userPosts && this.displayTopPosters(userPosts) }
            </List>

          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}>
            <Icon name='dropdown' />
            <Icon name='pencil alternate' />
            Created by

            </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as = 'h3'>
            {channel && <Image circular src={channel.createdBy.avatar} />}
          {channel && channel.createdBy.name}
            </Header>

          </Accordion.Content>

        </Accordion>

   </Segment>
    )
  }
}

export default MetaPanel
