import React from "react";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import Messages from "./Messages/Messages";
import SidePanel from "./SidePanel/SidePanel";
import MetaPanel from "./MetaPanel/MetaPanel";
import "./App.css";
import { connect } from 'react-redux';
import { setUserPosts } from '../actions'

const App = ({currentUser, currentChannel, isPrivateChannel, setUserPosts, userPosts}) => {
  return (
    <Grid columns= "equal" className ="app" style ={{background: '#eee'}}>
      <ColorPanel currentUser={currentUser} key={ currentUser &&currentUser.name}/>
      <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser}/>
      <Grid.Column style ={{marginLeft: 320}}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
          setUserPosts ={setUserPosts}
          />
      </Grid.Column>
      <Grid.Column width ={4}>
        <MetaPanel
          key={currentChannel && currentChannel.name}
          isPrivateChannel={isPrivateChannel}
          currentChannel={currentChannel}
          userPosts = { userPosts}
          />
</Grid.Column>

    </Grid>
  );
};
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts
})

 export default connect(mapStateToProps, {setUserPosts})(App);
