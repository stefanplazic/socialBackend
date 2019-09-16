import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './SearchBox.css';
import { searchUsers, searchTags } from '../../api/searchService';

class SearchBox extends Component {


    state = { result: '', show: true };


    render() {

        return (

            <form className="navbar-form my_form" role="search" onSubmit={this.handleSubmit}>
                <div className="input-group">
                    <input type="text" size="40" className="form-control my_input" placeholder="search"
                        onChange={this.onChangeFun}
                        onBlur={this.blureMethod}
                        onFocus={this.focusMethod} />

                </div>
                {this.renderResults()}
            </form>
        );
    }

    renderResults() {
        if (this.state.result !== '' && this.state.show) {
            return (this.state.result);

        }

    }
    blureMethod = () => {

        setTimeout(
            function () {
                this.setState({ show: false });
            }
                .bind(this),
            100
        );

    }

    focusMethod = () => {

        this.setState({ show: true });

    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    onChangeFun = async (event) => {
        const term = event.target.value;
        if (term !== '') {
            if (term.charAt(0) === '#') {
                //render hashtags
                if (term.length > 1 && term.split("#").length - 1 === 1) {
                    const hashtags = await this.hashtagSearch(term.substr(1));
                    this.setState({ result: hashtags });
                }

            }
            else {
                //render users
                const users = await this.userSearch(term);
                this.setState({ result: users });
            }
        }
        else
            this.setState({ result: '' });
    }

    renderHashTags() {

    }


    userSearch = async (username) => {
        const response = await searchUsers(username);
        if (response.success) {

            const users = response.results.map((user) =>
                <Link to={'/profile/' + user._id} key={user._id}>
                    <div className="row hover_div" >
                        <div className="col-2">
                            <img className="user_avatar" alt="user profile" src={user.avatar}
                            />
                        </div>
                        <div className="col-10">
                            <span className="my-auto ">
                                {user.username}
                            </span>

                        </div>
                    </div>
                </Link>
            );

            return (<div className="bd-search-results">
                {users}

            </div>);
        }

    }

    hashtagSearch = async (hashtag) => {
        const response = await searchTags(hashtag);
        if (response !== null && response.success) {
            const tags = response.results.map((tag) =>
                <Link to={'/byTags/' + tag.name} key={tag._id}>
                    <div className="row hover_div" >
                        <div className="col-1">
                            <span className="my_hash">
                                #
                        </span>
                        </div>
                        <div className="col-5">

                            <span className="my-auto">
                                <div className="name_div">{tag.name}</div>
                                <div className="num_div">{tag.postsNum} posts</div>
                            </span>
                        </div>
                        <div className="col-6"></div>
                    </div>
                </Link>

            );

            return (
                <div className="bd-search-results">
                    {tags}

                </div >
            );
        }
    }


}

export default SearchBox;
