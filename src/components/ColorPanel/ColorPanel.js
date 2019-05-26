import React, { Component } from 'react';
import {
  Button,
  Divider,
  Icon,
  Label,
  Menu,
  Modal,
  Sidebar
} from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import firebase from '../../firebase';

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: '',
    secondary: '',
    user:this.props.currentUser,
    userRef: firebase.database().ref('users'),
    userColors: []

  };
  componentDidMount() {
    if (this.state.user) {
      this.addListener(this.state.user.uid);
    }
  }

  addListener = userId => {
    let userColors = [];
    this.state.userRef.child(`${userId}`).child('colors')
      .on('child_added', snap => {
        userColors.push(snap.val())
        this.setState({ userColors: userColors })

      })

  }
  saveColors = (primary, secondary) => {
    this.state.userRef
      .child(`${this.state.user.uid}/colors`)
      .push()
      .update({
        primary: primary,
        secondary: secondary
      }).then(() => {
        console.log('colors added');
        this.closeModal();
      })
      .catch(err => { console.error(err) });

  }
  displayUserColors = colors =>(
    colors.length > 0 && colors.map((color, i) =>(
        <React.Fragment key={i}>
          <Divider />
          <div className="color__container">
            <div className="color__square" style = {{background:color.primary}}>
              <div className="color__overlay" style = {{background:color.secondary}}></div>
            </div>
          </div>
        </React.Fragment>
      )))

  handlePrimaryColorChange = color => {
    this.setState({primary: color.hex})
  };
  handleSecondaryColorChange = color =>{ this.setState({secondary: color.hex})}
  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });
  render() {
    const { modal, primary, secondary, userColors } = this.state;
    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin">
        <Divider />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        {this.displayUserColors(userColors)}
        {/* color picker modal */}
        <Modal basic open={modal} onClose={this.closeModal} >
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Label content='primary color'/>
            <SliderPicker color={primary} onChange={this.handlePrimaryColorChange}/>
            <Label  content='secondary color' />
            <SliderPicker  color={secondary} onChange={this.handleSecondaryColorChange}/>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' inverted onClick={() =>this.saveColors(primary, secondary)}>
              <Icon name='checkmark' /> Save Colors
            </Button>
            <Button color='red' inverted onClick ={this.closeModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </Modal.Actions>

        </Modal>

      </Sidebar>
    );
  }
}

export default ColorPanel;
