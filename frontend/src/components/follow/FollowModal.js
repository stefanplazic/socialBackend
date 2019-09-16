import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './FollowModal.css';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class FollowModal extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }

    renderUsers() {

        const users = this.props.users.map(function (item, i) {
            return <div className="row mb-4 border_div" key={item._id}>
                <div className="col-2 col-md-2 col-sm-2 lg-2">
                    <img  className="img-fluid prof_img" src={item.avatar}
                        alt="Profile avatar" />
                </div>
                <div className="col-7 col-md-8 col-sm-4 lg-8">{item.username}</div>
                <div className="col-3 col-md-2 col-sm-6 lg-2">

                    <Link to={'/profile/' + item._id} className="btn btn-primary">View</Link>
                </div>
                <hr />
            </div>

        });

        return users;

    }

    render() {

        return (

            <Modal isOpen={this.props.isOpen} size={"lg"} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>
                    <span className="titlespan">{this.props.title}</span>

                </ModalHeader>
                <ModalBody>

                    {this.renderUsers()}


                </ModalBody>
            </Modal>




        );
    }



}

export default FollowModal;
