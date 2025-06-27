// src/components/MessageInput.js
import React, { useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

const MessageInput = ({ room }) => {
  const [message, setMessage] = useState('');
  const { socket } = useSocket();
  const typingTimeoutRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket || !room) return;

    const roomId = room.type === 'dm' ? `dm_${room.id}` : room.id;

    socket.emit('sendMessage', {
      roomId,
      content: message.trim()
    });

    setMessage('');
    clearTimeout(typingTimeoutRef.current);
    socket.emit('stopTyping', { roomId });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (!socket || !room) return;

    const roomId = room.type === 'dm' ? `dm_${room.id}` : room.id;

    // Emit typing event
    socket.emit('typing', { roomId });

    // Clear existing timeout
    clearTimeout(typingTimeoutRef.current);

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { roomId });
    }, 2000);
  };

  const getPlaceholderText = () => {
    if (room.type === 'dm') {
      if (room.members) {
        const otherUser = room.members.find(member => member._id !== room.currentUserId);
        return `Message ${otherUser?.name || 'user'}...`;
      }
      return 'Type a message...';
    }
    return `Message ${room.name}...`;
  };

  if (!room) return null;

  return (
  <div className="p-6 bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50">
  <form onSubmit={sendMessage} className="flex gap-4 items-end">
    <div className="flex-1 relative">
      <input
        type="text"
        value={message}
        onChange={handleTyping}
        placeholder={getPlaceholderText()}
        className="w-full p-4 pr-12 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200 hover:shadow-xl"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
    <button
      type="submit"
      disabled={!message.trim()}
      className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white p-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
    >
      <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </button>
  </form>
</div>
  );
};

export default MessageInput;