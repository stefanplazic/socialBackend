import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Likes.css';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { GetLikes } from '../../api/likeService';
import { getUserId } from '../../utils/authHelper';
class Likes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            likes: [],
            postId: ''
        };

    }
    async componentDidMount() {
        const postId = this.props.postId;
        this.setState({ postId: postId });
        const response = await GetLikes(postId);
        if (response && response.success) {
            this.setState({ likes: response.results.likes });
            this.isLiked(response.results.likes);
        }

    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.postId && nextProps.upateFlag) {
            const response = await GetLikes(nextProps.postId);
            if (response && response.success) {
                this.setState({ likes: response.results.likes, postId: nextProps.postId });
                this.isLiked(response.results.likes);
            }
        }
    }

    ifLiked = (likes) => {

    }

    renderLikes() {
        const likes = this.state.likes.map(function (like) {
            return <div className="row " key={like._id}>
                <div className="col-4"><img className="avatar_img" alt="user avatar" src={like.author.avatar} /></div>
                <div className="col-4 borderd_div">{like.author.username}</div>
                <div className="col-4">
                <Link to={'/profile/'+like.author._id} className="btn btn-primary">View</Link>
                </div>
            </div>
        });
        return (<div className="container likes_div"> {likes}</div>);
    }

    render() {

        return (
            <Modal isOpen={this.props.isOpen} size={"sm"} toggle={this.props.toggle}>
                <ModalHeader toggle={this.toggle}>
                    Likes

                </ModalHeader>
                <ModalBody>
                    {this.renderLikes()}
                </ModalBody>
            </Modal>

        );
    }

    isLiked = async (likes = []) => {
        const userId = await getUserId();
        const result = likes.filter(function (item) {
            return item.author._id === userId;
        });
        this.props.updateIsLiked(result.length !== 0 ? true : false, likes.length);
        this.props.updateLikeModal(false);
    }

}

export default Likes;
