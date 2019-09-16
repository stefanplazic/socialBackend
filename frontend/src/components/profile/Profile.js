import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './Profile.css';
import { userData, follow, unFollow } from '../../api/userService';
import { getUserId } from '../../utils/authHelper';
import MyVideo from '../video/Video';
import VideoModal from '../videoModal/VideoModal';
import FollowModal from '../follow/FollowModal';
import AvatarModal from '../avatarModal/AvatarModal';
import { commentsByPost } from '../../api/commentService';

class Profile extends Component {
    state = {
        posts: [],
        userData: { following: [], followers: [] },
        isFollowing: true,
        isOwner: true,
        userId: '',
        showFollowersModal: false,
        showFollowingModal: false,
        singlePost: { author: {} },
        comments: [],
        showModal: false,
        showAvatarModal: false

    };
    async componentDidMount() {
        this.loadData();
        document.addEventListener('scroll', this.playVideos);
    }
    componentWillUnmount() {

        document.removeEventListener('scroll', this.playVideos);
    }

    componentWillReceiveProps() {
        this.loadData();
    }

    renderFollowBtn() {
        if (this.state.isOwner)
            return null;
        const renderFollowBtn = !this.state.isFollowing ? (<button type="button" className="btn btn-primary" onClick={this.followUser}>Follow</button>) :
            (<button type="button" className="btn btn-primary" onClick={this.unfollowUser}>Unfollow</button>);
        return renderFollowBtn;

    }

    renderAvatar() {
        if (this.state.isOwner)
            return (<img className="img_cls  user_avatar " src={this.state.userData.avatar} alt="Profile avatar" onClick={this.togleAvatarModal}></img>);

        return (<img align="left" className="img_cls" src={this.state.userData.avatar} alt="Profile avatar"></img>);
    }

    render() {

        return (
            <div className="container">
                <div className="row d-none d-sm-flex">
                    <div className="col-3 col-md-2">
                        {this.renderAvatar()}
                    </div>
                    <div className="col-3 col-md-3">
                        <h2>{this.state.userData.username}</h2>
                    </div>
                    <div className="col-6 col-md-7">
                        <div className="row">
                            <div className="col-4">
                                <p className="text-center" >Following:</p>
                                <p className="text-center text-primary follow_div" onClick={this.togleFollowingModal}>{this.state.userData.following.length}</p>
                            </div>
                            <div className="col-4 ">
                                <p className="text-center" >Followers:</p>
                                <p className="text-center text-primary follow_div" onClick={this.togleFollowersModal}>{this.state.userData.followers.length}</p>
                            </div>
                            <div className="col-4 ">
                                {this.renderFollowBtn()}
                            </div>
                        </div>
                    </div>
                </div>

                {/*FOR SMALL SCREENS */}

                <div className="row d-sm-none">
                    <div className="col-6 text-center">
                        {this.renderAvatar()}
                    </div>
                    <div className="col-6 text-left">
                        <h2>{this.state.userData.username}</h2>
                    </div>

                </div>
                <div className="row d-sm-none custom_margin_top">



                    <div className="col-6">
                        <p className="text-center" >Following:</p>
                        <p className="text-center text-primary follow_div" onClick={this.togleFollowingModal}>{this.state.userData.following.length}</p>
                    </div>
                    <div className="col-6 ">
                        <p className="text-center" >Followers:</p>
                        <p className="text-center text-primary follow_div" onClick={this.togleFollowersModal}>{this.state.userData.followers.length}</p>
                    </div>



                </div>
                <div className="row d-sm-none">
                    <div className="col-12 text-center">
                        {this.renderFollowBtn()}
                    </div>
                </div>

                {/*END OF FOR SMALL SCREENS */}

                <hr />
                {this.renderPosts()}
                <FollowModal isOpen={this.state.showFollowersModal}
                    users={this.state.userData.followers}
                    title={'Followers'}
                    toggle={this.togleFollowersModal} />
                <FollowModal isOpen={this.state.showFollowingModal}
                    users={this.state.userData.following}
                    title={'Following'}
                    toggle={this.togleFollowingModal} />

                <VideoModal
                    toggle={this.togleModal}
                    isOpen={this.state.showModal}
                    post={this.state.singlePost}
                    scrollable={true}
                    comments={this.state.comments}
                    addComment={this.addComment}
                    isOwner={this.state.isOwner} />

                <AvatarModal
                    toggle={this.togleAvatarModal}
                    isOpen={this.state.showAvatarModal}
                    updateAvatar={this.updateAvatar} />
            </div>



        );
    }
    togleAvatarModal = () => {
        this.setState({ showAvatarModal: !this.state.showAvatarModal });
    }

    togleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }
    addComment = (comment) => {
        this.setState({ comments: [...this.state.comments, comment] });
    }

    /*LOAD THE DATA */
    loadData = async () => {
        const myId = await getUserId();
        const userId = this.props.match.params.userId;
        var result = await userData(userId);

        if (result.success) {

            const isOwner = (myId === userId);
            const isFollowing = result.userData.result.followers.filter(function (item) {
                return item._id === myId;
            }).length > 0 ? true : false;

            this.setState({
                posts: result.userData.posts,
                userData: result.userData.result,
                isOwner: isOwner,
                userId: myId,
                isFollowing: isFollowing,
                showFollowersModal: false,
                showFollowingModal: false
            });

            const params = new URLSearchParams(this.props.location.search);
            if (params.get('post')) {
                //show the post
                const post = result.userData.posts.filter(function (post) {
                    return post._id === params.get('post');
                });
                if (post.length > 0)
                    //console.log(post);
                    this.openModal(post[0]);

            }

        }
    }

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

    renderPosts = () => {
        //manage profile
        let columns = [];
        let mobileColumns = [];
        this.state.posts.forEach((item, idx) => {

            // push column
            columns.push(
                <div className="col-4" key={item._id}>
                    <MyVideo post={item} openAction={this.openModal} />
                </div>
            )
            mobileColumns.push(
                <div key={idx} className="row mb-2">

                    <div className="col-12" >
                        <MyVideo post={item} openAction={this.openModal} />
                    </div>

                </div>
            );

            // force wrap to next row every 4 columns
            if ((idx + 1) % 3 === 0) { columns.push(<div key={idx} className="w-100 mb-2"></div>) }
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

    openModal = async (post) => {
        this.setState({ singlePost: post });
        this.setState({ showModal: true });
        const comments = await commentsByPost(post._id);
        this.setState({ comments: comments.results });

    }

    followUser = async () => {
        const userId = this.state.userData._id;
        const result = await follow(userId);
        if (result.success) {
            var userData = this.state.userData;
            userData.followers.push(result.user);
            this.setState({ isFollowing: true, userData: userData });
        }

    }

    togleFollowersModal = () => {
        if (this.state.userData.followers.length > 0)
            this.setState({ showFollowersModal: !this.state.showFollowersModal });
    }

    togleFollowingModal = () => {
        if (this.state.userData.following.length > 0)
            this.setState({ showFollowingModal: !this.state.showFollowingModal });
    }

    /*UNFOLLOW USER*/
    unfollowUser = async () => {
        const response = await unFollow(this.state.userData._id);
        if (response.success) {
            //remove user from  state array
            var userData = this.state.userData;
            const userId = this.state.userId;//changed
            userData.followers = userData.followers.filter(function (item) {
                return item._id !== userId;
            });
            this.setState({ isFollowing: false, userData: userData });
        }
    }
    updateAvatar = (avatarUri) => {
        var userData = this.state.userData;
        userData.avatar = avatarUri;
        this.setState({ userData: userData });
    }
}

export default withRouter(Profile);
