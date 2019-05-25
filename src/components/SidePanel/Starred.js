import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from '../../firebase'

class Starred extends Component {
    state = {
        starredChannels: [],
        activeChannel: '',
        user: this.props.currentUser,
        userRef: firebase.database().ref('users')
    }

    componentDidMount() {
        if(this.state.user){
        this.addStarredChannelListner();}
    }

    addStarredChannelListner = () => {
        const ref = this.state.userRef.child(`${this.state.user.uid}`).child('starred');

        ref.on('child_added', snap => {
            const starredChannels = { id: snap.key, ...snap.val() }
            this.setState({starredChannels:[...this.state.starredChannels, starredChannels]})
        });
        ref.on('child_removed', snap => {
            const channelToRemove = { id:snap.key, ...snap.val()}
            const updatedChannels = this.state.starredChannels.filter(channel => {
                return channel.id !== channelToRemove.id;
            })
           this.setState({starredChannels: updatedChannels})
        })

    }
    setActiveChannel = (channel) => {
        this.setState({activeChannel: channel.id})
    }
    changeChannel = channel => {

        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.props.setActiveChannel(channel.id);

      };
    displayChannels = starredChannels =>
    starredChannels.length && starredChannels.map(starredChannel => (
      <Menu.Item
        key = {starredChannel.id}
        name={starredChannel.name}
        style={{ opacity: 0.7 }}
        onClick={() => this.changeChannel(starredChannel)}
        active={starredChannel.id === this.props.activeChannel}
      >

        #{" " + starredChannel.name}
      </Menu.Item>
    ));
    render() {
        const { starredChannels } = this.state;
        return (
            <Menu.Menu className ='menu'>
            <Menu.Item>
              <span>
                <Icon name="star" />
                CHANNELS
              </span>{' '}
                    ({starredChannels.length})
            </Menu.Item>

            {this.displayChannels(starredChannels)}
          </Menu.Menu>

        )
    }
}
const mapStateToProps = state =>({
currentUser: state.user.currentUser
})

export default connect(mapStateToProps, {setCurrentChannel, setPrivateChannel})(Starred)
