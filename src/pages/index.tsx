import React from 'react';
import Header from '../client/components/Header';
import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Chat() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [room, setRoom] = useState("")
  const [message, setMessage] = useState("")
  const [allMessages, setAllMessages] = useState<string[]>([])
  const joinRoom = () => {
    if (room && socket.socket) {
      socket.socket.emit("joinRoom", room)
    }
  };

  const leaveRoom = () => {
    if (room && socket.socket) {
      socket.socket.emit("leaveRoom", room)
    }
  };

  const sendMessage = () => {
    if (room && message && socket.socket) {
      socket.socket.emit("sendMessage", room)
    }
  };

  if (socket.isServer === false) {
    socket.socket.on("message", (newMessage: string) => {
      setAllMessages((prev: string[]) => [...prev, newMessage])
    })
  }

  useEffect(() => {
    if (socket.socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.socket.io.engine.transport.name);

      socket.socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.socket.on("connect", onConnect);
    socket.socket.on("disconnect", onDisconnect);

    return () => {
      socket.socket.off("connect", onConnect);
      socket.socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div>
      <div>
        <h1>Chat Application</h1>
        <div>
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
          <button onClick={leaveRoom}>Leave Room</button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div>
          <h2>Messages:</h2>
          {allMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </div>
      <Header />
      <p>hello</p>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
    </div>
  );
}