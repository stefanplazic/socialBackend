import React, { Component } from 'react';

import './AvatarModal.css';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { updateAvatar } from '../../api/userService';

class AvatarModal extends Component {

    state = {
        userAvatar: null,
        errMessage: '',
        isUploding: false,
    };

    render() {
        const isEnabled = (this.state.userAvatar !== null && !this.state.isUploding) ? false : true;

        return (

            <Modal isOpen={this.props.isOpen} size={"md"} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>

                    <span>Update your avatar</span>

                </ModalHeader>
                <ModalBody>
                    {this.renderErrorMessage()}

                    <div className="custom-file">
                        <input type="file" className="custom-file-input" lang="es" onChange={this.onChange} />
                        <label className="custom-file-label" htmlFor="customFileLang">Image</label>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-primary" disabled={isEnabled} onClick={this.uploadImage}>Upload</button>
                </ModalFooter>
            </Modal>




        );
    }

    renderErrorMessage() {
        const erroMessage = (this.state.errMessage !== '') ?
            (<div className="alert alert-danger error_message" role="alert">
                {this.state.errMessage}
            </div>) : null;
        return erroMessage;
    }

    onChange = (event) => {
        const fileToUpload = event.target.files[0];

        if (this.validateFile(fileToUpload))
            this.setState({ userAvatar: fileToUpload });
        else {

            this.setState({ userAvatar: null });
        }

    }

    uploadImage = async () => {
        this.setState({ isUploding: true });
        const response = await updateAvatar(this.state.userAvatar);
        this.setState({ isUploding: false, userAvatar: null, errMessage: '' });
        if (response.success) {
            this.props.updateAvatar(response.avatarPath);
            this.props.toggle();
        }
        else {
            this.setState({ errMessage: 'Please try again' });
        }
    }

    //helper file type validation
    validateFile(file) {
        console.log(file['type']);
        const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        if (file && acceptedImageTypes.includes(file['type'])) {
            this.setState({ errMessage: '' });
            return true;
        }
        this.setState({ errMessage: 'File must be image' });
        return false;
    }


}

export default AvatarModal;
