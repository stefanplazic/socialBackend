import React, { Component } from 'react';

import './Home.css';
import MyVideo from '../video/Video';
import VideoModal from '../videoModal/VideoModal';
import CreatePostModal from '../createPost/createPost';
import socketUtil from '../../utils/socketUtil';
import { latestPosts, newestPosts } from '../../api/postService';
import { commentsByPost } from '../../api/commentService';
import { getUserId } from '../../utils/authHelper';
import { isVerifed } from '../../api/userService';
import Spiner from '../spinner/Spinner';



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      singlePost: { author: {} },
      showPostModal: false,
      posts: [],
      followingPost: [],
      isLoading: false,
      page: 0,
      followingPage: 0,
      comments: [],
      loadFlag: true,
      loadFollowing: true,
      fetchType: 'following',
      Verified: true,
      email: ''
    };


  }

  async componentDidMount() {
    this.loadPosts();
    const userId = await getUserId();
    socketUtil.instance.on('home/' + userId, (post) => {

      var posts = this.state.followingPost;
      const list = [post, ...posts];
      this.setState({ followingPost: list });
    });
    document.addEventListener('scroll', this.trackScrolling);
    document.addEventListener('scroll', this.playVideos);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
    document.removeEventListener('scroll', this.playVideos);
  }




  render() {

    const posts = this.renderPosts();
    return (
      <div className="container" id="holder">
        {this.renderNotVerified()}
        <div className="row mb-4">
          <div className="col-6 text-center">
            <span className="text-primary my_link " onClick={() => this.setFetchType('following')}>Following</span>

          </div>
          <div className="col-6 text-center">

            <span className="text-primary my_link " onClick={() => this.setFetchType('popular')}>Popular</span>
          </div>

        </div>
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1>Enjoy posts</h1>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-4">
            <button type="button" className="btn btn-primary" onClick={this.toglePostModal}>Create</button>
          </div>

        </div>


        {posts}
        {this.renderSpinner()}

        <VideoModal
          toggle={this.togleModal}
          isOpen={this.state.showModal}
          post={this.state.singlePost}
          scrollable={true}
          comments={this.state.comments}
          addComment={this.addComment} />

        <CreatePostModal
          toggle={this.toglePostModal}
          isOpen={this.state.showPostModal} />

      </div>
    );
  }

  //render not verified
  renderNotVerified() {
    if (!this.state.Verified)
      return (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          Please verify your email <b>{this.state.email}</b>
        </div>
      );
  }

  trackScrolling = async () => {
    if (this.state.isLoading || (this.state.fetchType === 'popular' && !this.state.loadFlag) || (this.state.fetchType === 'following' && !this.state.loadFollowing))
      return;

    const wrappedElement = document.getElementById('holder');
    if (this.isBottom(wrappedElement)) {
      //set loading to true
      this.setState({ isLoading: true });
      //load more content
      await this.loadPosts();
      //set loading to false
      this.setState({ isLoading: false });
    }
  }

  //play the videos
  playVideos = () => {
    var x = document.getElementsByClassName("square");
    try {
      for (var i = 0; i < x.length; i++) {
        var position = x[i].getBoundingClientRect();
        if (position.top >= 0 && position.bottom <= window.innerHeight) {
          x[i].play();

        }
        else {
          x[i].pause();
        }
      }
    } catch (error) {

    }

  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  togleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  }

  toglePostModal = () => {
    this.setState({ showPostModal: !this.state.showPostModal });
  }

  addComment = (comment) => {
    this.setState({ comments: [...this.state.comments, comment] });
  }

  openModal = async (post) => {

    this.setState({ singlePost: post });
    this.setState({ showModal: true });
    const comments = await commentsByPost(post._id);
    this.setState({ comments: comments.results });
  }

  renderPosts = () => {
    let columns = [];
    let mobileColumns = [];
    var posts = (this.state.fetchType === 'popular') ? this.state.posts : this.state.followingPost;
    posts.forEach((item, idx) => {

      // push column
      columns.push(
        <div className="col-4" key={item._id}>
          <MyVideo post={item} openAction={this.openModal} />
        </div>
      );
      mobileColumns.push(
        <div key={idx} className="row mb-2">

          <div className="col-12" >
            <MyVideo post={item} openAction={this.openModal} />
          </div>

        </div>
      );


      // force wrap to next row every 4 columns
      if ((idx + 1) % 3 === 0) { columns.push(<div key={idx} className="w-100 mb-2"></div>); }
    })
    return (
      <div>
        <div className="row d-none d-sm-flex">
          {columns}
        </div>
        <div className=" d-sm-none">
          {mobileColumns}
        </div>

      </div>
    )
  }



  renderSpinner() {
    const spinner = (this.state.isLoading) ? (<Spiner />) : null;
    return spinner;
  }

  loadPosts = async () => {
    //laod popular post
    if (this.state.fetchType === 'popular') {
      var response = await latestPosts(this.state.page);
      this.setState({ page: this.state.page + 1 });

      if (response.success) {
        var posts = this.state.posts;
        if (response.posts.length > 0) {
          posts.push(...response.posts);
          this.setState({ posts: posts });
        }
        else
          this.setState({ loadFlag: false });

      }

    }

    //load following posts
    else {
      var responseFollowing = await newestPosts(this.state.followingPage);

      this.setState({ followingPage: this.state.followingPage + 1 });

      if (responseFollowing && responseFollowing.success) {
        var postsFollowing = this.state.followingPost;
        if (responseFollowing.posts.length > 0) {
          postsFollowing.push(...responseFollowing.posts);
          this.setState({ followingPost: postsFollowing });
        }
        else
          this.setState({ loadFollowing: false });

      }

    }
    //check if user is verifed
    const verifiedResponse = await isVerifed();
    if (verifiedResponse && verifiedResponse.success) {

      this.setState({ email: verifiedResponse.email, Verified: verifiedResponse.result });

    }

  }

  setFetchType = (fetchType) => {

    this.setState({ fetchType: fetchType }, () => {
      if (fetchType === 'popular' && this.state.page === 0) {
        this.setState({ loadFlag: true }, () => {
          this.loadPosts();
        });

      }

    });


  }
}



export default Home;
