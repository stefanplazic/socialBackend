import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import './VideoModal.css';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { createComment } from '../../api/commentService';
import { Like, Unlike } from '../../api/likeService';
import Likes from './Likes';
import { deletePost } from '../../api/postService';

class VideoModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      isLiked: false,
      showLikeModal: false,
      likeNumber: 0,
      updateLikes: true
    };

  }

  componentDidMount() {
    this.setState({ likeNumber: this.props.post.likeNum });
  }


  renderComments() {

    const comments = this.props.comments.map(function (item, i) {
      var profilePath = "/profile/" + item.author._id;
      return <div className="row" key={i}>
        <div className="col-2 col-sm-2 col-md-1 col-lg-1 ">
          <img src={item.author.avatar} className="img  img-fluid" alt="user avatar" />

        </div>
        <div className="word_my col-7 col-sm-6 col-md-9 col-lg-9 ">
          <p>
            <Link to={profilePath} className="float-left"><strong>{item.author.username}</strong></Link>



          </p>
          <div className="clearfix"></div>
          <p>{item.content}</p>

        </div>
        <div className="col-3 col-sm-4 col-md-2 col-lg-2 ">
          <p className="small">{moment(item.creationDate).fromNow()}</p>
        </div>
      </div>

    });
    return comments;
  }

  renderTags() {
    const tags = (this.props.post.tags) ? this.props.post.tags : [];
    const result = tags.map(function (item) {
      return (<Link to={'/byTags/' + item.name} key={item._id}>#{item.name} </Link>);
    });
    return result;
  }

  render() {

    const ownerLink = "/profile/" + this.props.post.author._id;
    const deleteBtn = (this.props.isOwner) ? (<button className="float-right btn btn-danger" onClick={this.deletePost}>Delete</button>) : null;
    const liked = (this.state.isLiked) ?
      (<i className="fa fa-heart fa-lg liked" onClick={this.Unlike}></i>)
      :
      (<i className="fa fa-heart fa-lg not_liked" onClick={this.Like} ></i>);
    return (

      <Modal isOpen={this.props.isOpen} size={"lg"} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle} ><img src={this.props.post.author.avatar} className="user_av" alt="user avatar" />
          <Link to={ownerLink} ><strong>{this.props.post.author.username}</strong></Link>


          <span className="titlespan">{this.shortenString(this.props.post.title ? this.props.post.title : '')}</span>

        </ModalHeader>
        <ModalBody>

          <div className="embed-responsive embed-responsive-21by9 video_holder">

            <video loop="loop"
              controls

            >
              <source src={this.props.post.filePath} type="video/mp4" />
            </video>
          </div>

          {liked} <span className="like_num" onClick={this.toggleLikeModal}>{this.state.likeNumber} liked this</span>
          {deleteBtn}
          <hr />
          <div className="form-group">{this.renderTags()}</div>
          <div className="form-group">
            <input type="text" required className="form-control" placeholder="Type your comment"
              onChange={(event) => { this.setState({ comment: event.target.value }) }} value={this.state.comment}
              onKeyDown={this._handleKeyDown} />
          </div>

          <Likes isOpen={this.state.showLikeModal}
            toggle={this.toggleLikeModal}
            postId={this.props.post._id ? this.props.post._id : null}
            updateIsLiked={this.updateIsLiked}
            updateLikeModal={this.updateLikeModal}
            upateFlag={this.state.updateLikes}
          />

          {this.renderComments()}

        </ModalBody>
      </Modal>




    );
  }
  /*delete post */
  deletePost = async () => {
    //conferm the deletation
    const answer = window.confirm('Do you want to delete post!');
    if (answer) {
      deletePost(this.props.post._id);
      //close modal
      this.props.toggle();
    }

  }

  updateLikeModal = (updateFlag) => {
    this.setState({ updateLikes: updateFlag });
  }

  updateIsLiked = (liked, number) => {
    this.setState({ isLiked: liked, likeNumber: number });
  }

  toggleLikeModal = () => {
    this.setState({ showLikeModal: !this.state.showLikeModal });
  }
  Like = async () => {
    const response = await Like(this.props.post._id);
    if (response && response.success) {
      this.updateIsLiked(true, response.result);
      this.updateLikeModal(true);
    }

  }

  Unlike = async () => {
    const response = await Unlike(this.props.post._id);
    if (response && response.success) {
      this.updateIsLiked(false, response.result);
      this.updateLikeModal(true);
    }

  }

  _handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      const comment = this.state.comment;
      this.setState({ comment: '' });
      //save comment
      const response = await createComment({ post: this.props.post._id, content: comment });
      if (response.success) {
        this.props.addComment(response.result);
      }

    }
  }

  //function for shortning strings
  shortenString(myString) {
    const n = 55;
    return myString.length > n ? myString.substring(0, n - 1) + '...' : myString;
  }


}

export default VideoModal;
