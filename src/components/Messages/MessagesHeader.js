import React, { Component } from 'react';
import {Header, Segment, Input, Icon } from 'semantic-ui-react';

export class MessagesHeader extends Component {

  render() {
    const { currentChannel, numUniqueUsers, handleSearchChange, searchLoading , isPrivateChannel, handleStar, isChannelStarred} = this.props;

    return (
        <Segment clearing>
            {/* Channel Title */}
            <Header fluid ="true" as='h2' floated='left' style ={{marginBotton:0}}>
                <span>
                    {currentChannel && `${isPrivateChannel ? '@' : '#'}${currentChannel.name + ' '}`}
            {!isPrivateChannel &&
              <Icon
                name={isChannelStarred ? 'star' :'star outline'}
                color={ isChannelStarred ? 'yellow' : 'black'}
              onClick={handleStar}

                />}
                </span>
            {!isPrivateChannel && <Header.Subheader>{numUniqueUsers}</Header.Subheader>}
            </Header>

            {/* channel Search Input */}
            <Header floated="right">
          <Input
            loading = {searchLoading}
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
