import React, { Component } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';
import FileModal from './FileModal';
import uuidv4 from 'uuid/v4';
import ProgressBar from './ProgeressBar';

export class MessageForm extends Component {
  state = {
    sotrageRef: firebase.storage().ref(),
    uploadTask: '',
    uploadState: '',
    percentuploaded: 0,
    message: '',
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    modal: false
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileUrl = null) => {
    const message = {

      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };
    if (fileUrl !== null) {
      message['image'] = fileUrl
    } else {
      message['content'] = this.state.message;
    }
    return message;
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });

      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({
            loading: false,
            message: '',
            errors: []
          });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' })
      });
    }
  };
  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });
  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;
    this.setState(
      {
        uploadState: 'uploading',
        uploadTask: this.state.sotrageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          'state_changed',
          snap => {
            const percentuploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentuploaded: percentuploaded });
          },
          err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: 'error',
              uploadTask: null
            });
          },
          () => {

            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);

              })
              .catch(err => {
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: 'error',
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };
  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
      this.setState({uploadState:'done'})
      }).catch((err) => {
        console.error(err);
        this.setState({errors:this.state.errors.concat(err)})
    })
  }
  render() {
    const { errors, message, loading, modal , uploadState, percentuploaded} = this.state;
    return (
      <React.Fragment>
        <Segment className="message__form">
          <Input
            fluid
            name="message"
            style={{ marginBottom: '0.7rem' }}
            label={<Button icon={'add'} />}
            labelPosition="left"
            placeholder="Writ your message"
            onChange={this.handleChange}
            value={message}
            className={
              errors.some(error => error.message.includes('message'))
                ? 'error'
                : ''
            }
          />
          <Button.Group icon widths="2">
            <Button
              color="orange"
              content="Add Reply"
              labelPosition="left"
              icon="edit"
              onClick={this.sendMessage}
              disabled={loading}
            />
            <Button
              color="teal"
              content="Upload Media"
              labelPosition="right"
              icon="cloud upload"
              onClick={this.openModal}
              disabled ={uploadState === 'uploading'}
            />
            <FileModal
              modal={modal}
              closeModal={this.closeModal}
              uploadFile={this.uploadFile}
            />

          </Button.Group>
          <ProgressBar
              percentuploaded={percentuploaded}
              uploadState={uploadState}/>
        </Segment>

      </React.Fragment>
    );
  }
}

export default MessageForm;
