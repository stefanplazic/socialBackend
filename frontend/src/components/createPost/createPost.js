import React, { Component } from 'react';

import './createPost.css';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { uploadVideo } from '../../api/mediaService';
import { createPosts } from '../../api/postService';

class CreatePost extends Component {

    state = {
        postTitle: '',
        content: '',
        tags: '',
        isLoading: false,
        errVideoMessage: ''
    };

    onChange = (event) => {
        const fileToUpload = event.target.files[0];

        if (this.validateFile(fileToUpload))
            this.setState({ content: fileToUpload });
        else {

            this.setState({ content: '' });
        }

    }


    render() {
        const isEnabled = this.state.postTitle !== ''
            && this.state.content !== '' && !this.state.isLoading
            ? false : true;
        return (

            <Modal isOpen={this.props.isOpen} size={"md"} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>Create your post
        </ModalHeader>
                <ModalBody>

                    <form>

                        <div className="form-group">
                            <input type="text" required className="form-control" placeholder="Post title"
                                onChange={(event) => { this.setState({ postTitle: event.target.value }) }} value={this.state.postTitle} />
                        </div>
                        <div className="form-group">
                            <input type="text" required className="form-control" placeholder="#apples#horror"
                                onChange={(event) => { this.setState({ tags: event.target.value }) }} value={this.state.tags} />
                        </div>
                        {this.renderFileErrorMessage()}
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" id="customFileLang" lang="es" onChange={this.onChange} />
                            <label className="custom-file-label" htmlFor="customFileLang">Video File</label>
                        </div>


                    </form>
                </ModalBody>
                <ModalFooter>
                    <div className="form-group">
                        <input type="button" className="btn btn-secondary" disabled={isEnabled} value="Create" onClick={this.createPost} />
                    </div>
                </ModalFooter>

            </Modal>

        );
    }

    /* CREATING POST METHOD */
    createPost = async () => {
        if (this.state.postTitle !== '' && this.state.content !== '') {
            this.setState({ isLoading: true });
            this.props.toggle();
            const response = await uploadVideo(this.state.content);
            if (response.success) {
                var postTags = this.state.tags;
                if (postTags.charAt(0) === '#')
                    postTags = postTags.substr(1);
                postTags = postTags.split('#');
                if (this.state.tags === '')
                    postTags = [];
                //upload post
                await createPosts({ title: this.state.postTitle, filePath: response.videoPath, tags: postTags });
                this.setState({ postTitle: '', content: '', isLoading: false, tags: '' });


            }

        }
    }

    //helper function for video size
    validateFile(file) {

        if (file.type !== 'video/mp4') {
            this.setState({ errVideoMessage: 'File must be video' });
            return false;
        }
        if (file.size > 12 * 1024 * 1024) {
            this.setState({ errVideoMessage: 'Video must be smaller then 6 MB' });
            return false;
        }
        this.setState({ errVideoMessage: '' });
        var video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {

            window.URL.revokeObjectURL(video.src);

            if (video.duration < 1 || video.duration > 14) {

                alert("Video must be shorter then 14 seconds");
                return false;
            }
        }
        return true;
    }



    /*show file type error */
    renderFileErrorMessage() {
        const erroMessage = (this.state.errVideoMessage !== '') ?
            (<div className="alert alert-danger error_message" role="alert">
                {this.state.errVideoMessage}
            </div>) : null;
        return erroMessage;
    }
}

export default CreatePost;
