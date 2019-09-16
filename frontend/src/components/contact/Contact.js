import React, { Component } from 'react';

import './Contact.css';


class Contact extends Component {



    render() {

        return (




            <div className="container">

                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 pb-5">




                        <form >
                            <div className="card border-primary rounded-0">
                                <div className="card-header p-0">
                                    <div className="bg-primary text-white text-center py-2">
                                        <h3><i className="fa fa-envelope"></i> Contact Form</h3>

                                    </div>
                                </div>
                                <div className="card-body p-3">

                                    <div className="form-group">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text"><i className="fa fa-user text-info"></i></div>
                                            </div>
                                            <input type="text" className="form-control" id="nombre" placeholder="Name" required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text"><i className="fa fa-envelope text-info"></i></div>
                                            </div>
                                            <input type="email" className="form-control" name="email" placeholder="example@gmail.com" required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text"><i className="fa fa-comment text-info"></i></div>
                                            </div>
                                            <textarea className="form-control" placeholder="Type your message" required></textarea>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <input type="submit" value="Send" className="btn btn-primary btn-block rounded-0 py-2" />
                                    </div>
                                </div>

                            </div>
                        </form>



                    </div>
                </div>
            </div>

        );
    }
}

export default Contact;