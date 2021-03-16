import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import queryString from 'query-string';

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import UsersInRoom from '../UsersInRoom/UsersInRoom';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState('');
    const ENDPOINT = 'localhost:8080';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        socket.emit('join', { name, room }, () => {

        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })
    }, [messages]);

    useEffect(() => {
        socket.on('roomData', ({ users }) => setUsers(users));
    }, [users]);

    const sendMessage = e => {
        e.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    // console.log(message, messages);

    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <UsersInRoom users={users} />
        </div>
    )
}

export default Chat;