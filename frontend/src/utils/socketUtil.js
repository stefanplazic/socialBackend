import io from 'socket.io-client'
import { BASE_URL } from '../api/constants';

const socketConnection = {
    _instance: null,
    get instance() {
        if (!this._instance || !this._instance.connected) {
            this._instance = io(BASE_URL);
        }
        return this._instance;
    }
}

export default socketConnection;