import React, { Component } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
class FileModal extends Component {
    state = {
        file:null
    }

   addFile = event => {
       const file = event.target.files[0];
       console.log(file)
  }

  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal basic open={modal} onClose={this.closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
                <Input fluid label="file types: jpg, png" name="file" type="file" onChange={this.addFile}/>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted >
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
