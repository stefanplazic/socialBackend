import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import './Notifications.css';

import socketUtil from '../../utils/socketUtil';
import { getUserId } from '../../utils/authHelper';
import { NotificationList, Mark } from '../../api/notificationService';
import { PlopSound } from '../../assets/plop.mp3';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.conntection = null;
        this.state = { notifications: [], userId: '' };
    }
    async componentDidMount() {
        const userId = await getUserId();
        this.setState({ userId: userId });
        this.loadNot();
        this.conntection = socketUtil.instance.on('notification/' + userId, (notification) => {
            const audio = new Audio(PlopSound);
            audio.play();

            var notifications = this.state.notifications;
            const list = [notification, ...notifications];
            this.setState({ notifications: list });
            notifications = list.filter(function (item) {
                return item.isSeen === false
            });
            this.props.setUnreadMessages(notifications.length);
            //play the sound

        });


    }
    componentWillUnmount() {
        this.conntection.disconnect();
    }

    renderNotifications() {
        const notifications = this.state.notifications.map(function (not) {
            const isRead = !not.isSeen ? "not_read" : "not_link";
            if (not.notificationType === 'comment')
                return <li className={isRead} key={not._id} onClick={() => this.updateNotification(not)}>
                    <p>
                        {not.sender.username} has just commented on your post:
                        <br />
                        <i>{not.content.comment.content} </i>

                        <span className="timeline-icon">
                            <img src={not.sender.avatar} alt="profile avatar" />
                        </span>
                        <span className="timeline-date">{moment(not.creationDate).fromNow()}</span>
                    </p>
                </li>
            else if (not.notificationType === 'like')
                return <li className={isRead} key={not._id} onClick={() => this.updateNotification(not)}>
                    <p>
                        {not.sender.username} has just liked  your post:


                        <span className="timeline-icon">
                            <img src={not.sender.avatar} alt="profile avatar" />
                        </span>
                        <span className="timeline-date">{moment(not.creationDate).fromNow()}</span>
                    </p>
                </li>
            else
                return <li className={isRead} key={not._id} onClick={() => this.updateNotification(not)}>
                    <p>
                        {not.sender.username} just started following you.


                        <span className="timeline-icon">
                            <img src={not.sender.avatar} alt="profile avatar" />
                        </span>
                        <span className="timeline-date">{moment(not.creationDate).fromNow()}</span>
                    </p>
                </li>
        }, this);
        return (notifications);
    }

    render() {
        const notifications = (

            <ul className="dropdown-menu dropdown-menu-right " role="menu" aria-labelledby="dropdownMenu1">
                <li className="header_mine">
                    <span className="dropdown-menu-header ">Notifications</span>
                </li>
                <ul className="timeline timeline-icons timeline-sm ul_mine" >


                    {this.renderNotifications()}



                </ul>
                <li role="presentation">
                    <span className="dropdown-menu-header"></span>
                </li>
            </ul>
        );
        return (<div>{notifications}</div>);

    }



    //load previus notifications
    loadNot = async () => {
        const response = await NotificationList(this.state.userId);
        if (response && response.success) {
            this.setState({ notifications: response.results });
            //find unread ones
            const unread = response.results.filter(function (item) {
                return item.isSeen === false;
            });
            this.props.setUnreadMessages(unread.length);
        }
    }
    //update when notification is clicked
    updateNotification = async (notification) => {




        if (!notification.isSeen) {

            const response = await Mark(notification._id);
            if (response && response.success) {
                var notifications = this.state.notifications;
                notifications = notifications.filter(function (item) {
                    if (item._id === notification._id)
                        item.isSeen = true;
                    return item;
                });


                this.setState({ notification: notifications });

                notifications = notifications.filter(function (item) {
                    return item.isSeen === false
                });
                this.props.setUnreadMessages(notifications.length)
            }
        }

        if (notification.notificationType === 'follow') {
            //follow notification
            this.props.history.push('/profile/' + notification.sender._id);

        }
        else if (notification.notificationType === 'comment') {
            //comment notification
            this.props.history.push({
                pathname: '/profile/' + this.state.userId,
                search: '?post=' + notification.content.postId
            });

        }
        else if (notification.notificationType === 'like') {
            //like notification
            this.props.history.push({
                pathname: '/profile/' + notification.sender._id
            });
        }
    }



}
export default withRouter(Notifications);








