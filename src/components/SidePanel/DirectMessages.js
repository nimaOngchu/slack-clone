import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

class DirectMessages extends Component {
    state = {
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence'),
        setCurrentChannel: this.props.setCurrentChannel,

    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = (currentUserUid) => {
        let loadedUSers = [];
        this.state.usersRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUSers.push(user);
                this.setState({ users: loadedUSers });
            }
        });
        this.state.connectedRef.on('value', snap => {
            if (snap.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove()
            }
        });
        this.state.presenceRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                // add stataus to the user
                this.addStatusToUser(snap.key)
            }
        });

    }

    addStatusToUser = (userId, connected =true) => {
        const upadtedUsers = this.state.users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`
            }
            return acc.concat(user)
        }, []);

        this.setState({users:upadtedUsers})
    }

    isUserOnline = user => user.status === 'online';
    changeChannel = user => {
        const channelId = this.getChannerId(user.uid);
        this.props.setActiveChannel(user.uid);
        const channelData = {
            id: channelId,
            name: user.name
        }

        this.state.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);

    }
    getChannerId = userId => {
        const currentUserId = this.state.user.uid;
        return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    }
    render() {
        const { users } = this.state;

    return (
        <Menu.Menu className = 'menu'>
            <Menu.Item>
                <span>
                    <Icon name ='mail'/>DIRECT MESSAGES
                </span> {' '}
               ( {users.length})
            </Menu.Item>
            {users.map(user => (
                <Menu.Item
                className ={user.uid === this.props.activeChannel ? 'active' : ''}
                    key={user.uid}
                    onClick={() => this.changeChannel(user)}
                    style ={{opacity: 0.7, fontStyle: 'italic'}}
                >
                    <Icon
                        name='circle'
                        color = { this.isUserOnline(user) ? 'green' :'red'}
                    />
                    @{user.name}
                </Menu.Item>
            ))}
     </Menu.Menu>    )
  }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(DirectMessages)
