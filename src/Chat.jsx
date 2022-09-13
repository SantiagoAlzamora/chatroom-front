import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

export default function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("")
    const [messages, setMessages] = useState([])

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit("sendMessage", messageData)
            setMessages((messages) => [...messages, messageData])

        }
        setCurrentMessage("")
    }

    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            setMessages((messages) => [...messages, data])
        })
    }, [socket])

    return (
        <div className='chat-window'>
            <section className='chat-header'>
                <p>Live Chat</p>
            </section>
            <section className='chat-body'>
                <ScrollToBottom className='message-container'>
                    {
                        messages.map(data => {
                            return (
                                <div className='message' id={username === data.author ? 'you' : 'other'}>
                                    <div>
                                        <div className='message-content'>
                                            <p>{data.message}</p>
                                        </div>
                                        <div className='message-meta'>
                                            <p id="time">{data.time}</p>
                                            <p id="author">{data.author}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </ScrollToBottom>
            </section>
            <section className='chat-footer'>
                <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} placeholder='Type a text'
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
                <button onClick={sendMessage}>&#9658;</button>
            </section>
        </div>
    )
}
