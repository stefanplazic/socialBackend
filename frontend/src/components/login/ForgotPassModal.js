import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './Login.css';
import { forgotPassword } from '../../api/userService';

class ForgotPassModal extends Component {

    state = { message: '', email: '', error: '' };

    render() {


        return (

            <Modal isOpen={this.props.isOpen} size={"md"} toggle={this.props.toggle}>
                <ModalHeader toggle={this.toggle}>

                    <span>Password recovery</span>

                </ModalHeader>
                <form onSubmit={this.resetPassword}>
                    <ModalBody>
                        {this.renderMessage()}
                        {this.renderError()}
                        <div className="form-group">
                            <input type="email" required className="form-control" placeholder="Your Email *" onChange={(event) => { this.setState({ email: event.target.value }) }} value={this.state.email} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button type="submit" className="btn btn-primary" >Send</button>
                    </ModalFooter>
                </form>
            </Modal>




        );
    }

    renderMessage() {
        const erroMessage = (this.state.message !== '') ?
            (<div className="alert alert-success error_message" role="alert">
                {this.state.message}
            </div>) : null;
        return erroMessage;
    }

    renderError() {
        const erroMessage = (this.state.error !== '') ?
            (<div className="alert alert-danger error_message" role="alert">
                {this.state.error}
            </div>) : null;
        return erroMessage;
    }

    resetPassword = async (event) => {
        event.preventDefault();
        const response = await forgotPassword(this.state.email);
        if (response && response.success) {
            this.setState({ message: response.message, error: '' });
            //set timeout to clear data
            setTimeout(() => { this.setState({ message: '', error: '', email: '' }); }, 3000);
        }
        else {
            this.setState({ error: response.message });
            setTimeout(() => { this.setState({ message: '', error: '', email: '' }); }, 3000);
        }
    }



}

export default ForgotPassModal;
