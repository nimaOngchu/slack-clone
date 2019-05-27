import React, { Component } from 'react';
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button
} from 'semantic-ui-react';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    uploadedCroppedImage: '',
    blob: '',
    storageRef: firebase.storage().ref(),
    userAuthRef: firebase.auth().currentUser,
    userDatabaseRef: firebase.database().ref('users'),
    metadata: {
      contentType: 'image/jpeg'
    }
  };
  dropdownOptions = () => [
    {
      key: 'User',
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: 'Avatar',
      text: <span>Change Avatar</span>,
      onClick: this.openModal
    },
    {
      key: 'signout',

      text: <span>Sign Out</span>,
      onClick: this.handleSignOut
    }
  ];
  openModal = () => {
    this.setState({ modal: true });
  };
  closeModal = () => {
    this.setState({ modal: false });
  };
  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {});
  };
  handleChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };
  handleCrop = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageUrl,
          blob
        });
      });
    }
  };

  uploadCroppedImage = () => {
    const { storageRef, userAuthRef, blob, metadata } = this.state;
    storageRef
      .child(`avatars/user-${userAuthRef.uid}`)
      .put(blob, metadata)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadURL => {
          this.setState({ uploadedCroppedImage: downloadURL }, () =>
            this.changeAvatar()
          );
        });
      });
  };
  changeAvatar = () => {
    this.state.userAuthRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage
      })
      .then(() => {
        console.log('photoURL updated');
      })
      .catch(err => {
        console.error(err);
      });
    this.state.userDatabaseRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadedCroppedImage })
      .then(() => {
        console.log('user avatar updated');
      })
      .catch(err => {
        console.error(err);
      });
    this.closeModal();
  };
  render() {
    const { currentUser, primaryColor } = this.props;
    const { modal, previewImage, croppedImage } = this.state;

    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2rem', margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              DevChat
            </Header>
          </Grid.Row>
          {/* USer Dropdown */}
          <Header inverted style={{ padding: '.25rem' }} as="h4">
            <Dropdown
              trigger={
                <span>
                  <Image src={currentUser.photoURL} spaced="right" avatar />
                  {currentUser.displayName}
                </span>
              }
              options={this.dropdownOptions()}
            />
          </Header>
          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input
                fluid
                type="file"
                label="New Avatar"
                name="previewImage"
                onChange={this.handleChange}
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {previewImage && (
                      <AvatarEditor
                        ref={node => {
                          this.avatarEditor = node;
                        }}
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage && (
                      <Image
                        style={{ margin: ' 3.2rem auto' }}
                        width={100}
                        height={100}
                        src={croppedImage}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && (
                <Button
                  color="green"
                  inverted
                  onClick={this.uploadCroppedImage}>
                  <Icon name="save" />
                  Change Avatar
                </Button>
              )}

              <Button color="green" inverted onClick={this.handleCrop}>
                <Icon name="image" />
                Preview
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" />
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
