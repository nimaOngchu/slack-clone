import React, { Component } from 'react';
import {Header, Segment, Input, Icon } from 'semantic-ui-react';

export class MessagesHeader extends Component {

  render() {
    const { currentChannel, numUniqueUsers, handleSearchChange } = this.props;

    return (
        <Segment clearing>
            {/* Channel Title */}
            <Header fluid ="true" as='h2' floated='left' style ={{marginBotton:0}}>
                <span>
                    {currentChannel && `# ${currentChannel.name}`}
                    <Icon name={'star outline' } color='black'/>
                </span>
                <Header.Subheader>{numUniqueUsers}</Header.Subheader>
            </Header>

            {/* channel Search Input */}
            <Header floated="right">
                <Input
                    size='mini'
                    icon='search'
                    name='searchTerm'
            placeholder="Search Messages"
            onChange = {handleSearchChange}

                    />
            </Header>
   </Segment>
    )
  }
}

export default MessagesHeader
