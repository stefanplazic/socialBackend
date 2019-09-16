import React, { Component } from 'react';

import './HashPost.css';
import MyVideo from '../video/Video';
import VideoModal from '../videoModal/VideoModal';

import { commentsByPost } from '../../api/commentService';
import { postsByTag } from '../../api/searchService';
import Spiner from '../spinner/Spinner';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            singlePost: { author: {} },
            posts: [],
            isLoading: false,
            page: 0,
            comments: [],
            loadFlag: true,
            tagName: ''
        };


    }

    async componentDidMount() {
        const tag = this.props.match.params.tag;
        this.setState({ tagName: tag });
        this.loadPosts();

        document.addEventListener('scroll', this.trackScrolling);
        document.addEventListener('scroll', this.playVideos);
    }
    componentWillReceiveProps(nextProps) {
        const tag = nextProps.match.params.tag;
        this.setState({ posts: [], tagName: tag, page: 0 }, () => {
            this.loadPosts();
        });



    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        document.removeEventListener('scroll', this.playVideos);
    }


    render() {

        const posts = this.renderPosts();
        return (
            <div className="container" id="holder">


                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <h1>#{this.state.tagName}</h1>
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

            </div>
        );
    }

    trackScrolling = async () => {
        if (this.state.isLoading || !this.state.loadFlag)
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
        //console.log(x[0]);
        for (var i = 0; i < x.length; i++) {
            var position = x[i].getBoundingClientRect();
            if (position.top >= 0 && position.bottom <= window.innerHeight) {
                x[i].play();

            }
            else {
                x[i].pause();
            }
        }
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    togleModal = () => {
        this.setState({ showModal: !this.state.showModal });
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
        var posts = this.state.posts;
        posts.forEach((item, idx) => {

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

    renderSpinner() {
        const spinner = (this.state.isLoading) ? (<Spiner />) : null;
        return spinner;
    }

    loadPosts = async () => {

        const tag = this.props.match.params.tag;
        const response = await postsByTag(tag, this.state.page);
        if (response !== null && response.success) {
            var posts = this.state.posts;
            if (response.results.length > 0) {
                posts.push(...response.results);
                this.setState({ posts: posts, page: this.state.page + 1 });
            }
            else
                this.setState({ loadFlag: false });
        }
    }

}

export default Home;
