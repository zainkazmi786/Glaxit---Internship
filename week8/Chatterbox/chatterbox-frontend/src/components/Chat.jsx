
// src/components/Chat.js
import React, { useState } from 'react';
import Layout from './Layout';
import RoomList from './RoomList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleRoomSelect = (room) => {
    setCurrentRoom({
      id: room._id,
      name: room.name,
      type: 'room',
      isDM: room.isDM || false, // Handle DM rooms
      members: room.members || [],
      admins: room.admins || [],
      isPrivate: room.isPrivate
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="h-screen flex pt-20">
          <div className="transition-all duration-300 ease-in-out">
            <RoomList
              onRoomSelect={handleRoomSelect}
              currentRoom={currentRoom}
            />
          </div>
          <div className="flex-1 flex flex-col backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-l border-slate-200/50 dark:border-slate-700/50">
            <div className="flex-1 overflow-hidden rounded-tl-2xl shadow-inner">
              <MessageList room={currentRoom} />
            </div>
            <div className="border-t border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <MessageInput room={currentRoom} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;