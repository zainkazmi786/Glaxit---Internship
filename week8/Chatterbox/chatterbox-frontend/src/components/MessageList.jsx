// src/components/MessageList.js
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import MessageAvatar from './MessageAvatar';

const MessageList = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [deletingMessage, setDeletingMessage] = useState(null);
  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (room) {
      fetchMessages();
      joinRoom();
    }
  }, [room]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', handleNewMessage);
      socket.on('typing', handleTyping);
      socket.on('stopTyping', handleStopTyping);
      socket.on('messageDeleted', handleMessageDeleted);
      // socket.on('userOnline', handleUserOnline);
      // socket.on('userOffline', handleUserOffline);

      return () => {
        socket.off('receiveMessage', handleNewMessage);
        socket.off('typing', handleTyping);
        socket.off('stopTyping', handleStopTyping);
        socket.off('messageDeleted', handleMessageDeleted);
        // socket.off('userOnline', handleUserOnline);
        // socket.off('userOffline', handleUserOffline);
      };
    }
  }, [socket, room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!room) return;

    try {
      const response = await api.get(`/api/messages/${room.id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const joinRoom = () => {
    if (socket && room) {
      const roomId = room.type === 'dm' ? `dm_${room.id}` : room.id;
      socket.emit('joinRoom', { roomId });
    }
  };

  const handleNewMessage = (message) => {
    const roomId = room.type === 'dm' ? `dm_${room.id}` : room.id;
    if (message.roomId === roomId) {
      setMessages(prev => [...prev, message]);
    }
  };

  const handleTyping = (data) => {
    const roomId = room.type === 'dm' ? `dm_${room.id}` : room.id;
    if (data.roomId === roomId && data.userId !== user?.id) {
      setTypingUsers(prev => new Set(prev).add(data.userName));
    }
  };

  const handleStopTyping = (data) => {
    const roomId = room.type === 'dm' ? `dm_${room.id}` : room.id;
    if (data.roomId === roomId) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userName);
        return newSet;
      });
    }
  };

  const handleMessageDeleted = (data) => {
    const roomId = room.id;
    console.log('Message deleted event received:', data);
    if (data.roomId === roomId) {
      setMessages(prev => prev.map(msg =>
        (msg.id === data.messageId || msg._id === data.messageId)
          ? { ...msg, content: 'This message has been deleted', deleted: true }
          : msg
      ));
    }
  };

  // const handleUserOnline = (data) => {
  //   setOnlineUsers(prev => new Set(prev).add(data.userId));
  // };

  // const handleUserOffline = (data) => {
  //   setOnlineUsers(prev => {
  //     const newSet = new Set(prev);
  //     newSet.delete(data.userId);
  //     return newSet;
  //   });
  // };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if current user can delete a message
  const canDeleteMessage = (message) => {
    // User can delete their own messages
    if (message.senderId === user?.id) {
      return true;
    }

    // Room admins can delete any message in their room
    if (room && room.admins) {
      const isRoomAdmin = room.admins.some(admin =>
        (admin._id === user?.id) || (admin === user?.id)
      );
      if (isRoomAdmin) {
        return true;
      }
    }

    // Global admins can delete any message
    if (user?.role === 'admin') {
      return true;
    }

    return false;
  };

  // Delete message function
  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      setDeletingMessage(messageId);
      // await api.delete(`/api/messages/${messageId}`);
      socket.emit('deleteMessage', {
        roomId: room.id,
        messageId,
      })
      // The message will be updated via socket event
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert(error.response?.data?.message || 'Failed to delete message');
    } finally {
      setDeletingMessage(null);
    }
  };

  const getRoomDisplayName = () => {
    console.log('getRoomDisplayName called with room:', room);
    if (room.isDM) {
      if (room.members) {
        const otherUser = room.members.find(member => member._id !== user?.id);
        return otherUser?.name || 'Direct Message';
      }
      return 'Direct Message';
    }
    return room.name;
  };

  const getRoomStatus = () => {
    if (room.isDM) {
      if (room.members) {
        const otherUser = room.members.find(member => member._id !== user?.id);
        if (otherUser && onlineUsers.has(otherUser._id)) {
          return 'Online';
        }
        return 'Offline';
      }
      return 'Direct Message';
    }
    return room.isPrivate ? 'Private Room' : 'Public Room';
  };

  const getOnlineIndicator = () => {
    if (room.type === 'dm' && room.members) {
      const otherUser = room.members.find(member => member._id !== user?.id);
      if (otherUser && onlineUsers.has(otherUser._id)) {
        return (
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        );
      }
    }
    return null;
  };

  if (!room) {
return (
  <div className="bg-gradient-to-b from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-sm flex items-center justify-center h-full">
    <p className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 drop-shadow-lg p-10">
      Select a room to start chatting
    </p>
  </div>
);

  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-sm">
      <div className="p-6 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              {getRoomDisplayName().charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">{getRoomDisplayName()}</h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">{getRoomStatus()}</p>
                {getOnlineIndicator()}
              </div>
            </div>
          </div>
        </div>

        {room.inviteCode && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 015.743-7.743z" />
                </svg>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Invite Code: {room.inviteCode}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(room.inviteCode);
                  alert('Invite code copied to clipboard!');
                }}
                className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              >
                Copy Code
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message.id || message._id}
            className={`flex gap-4 group relative animate-fade-in ${message.senderId === user?.id ? 'justify-end' : ''}`}
          >
            {message.senderId !== user?.id && (
              <div className="relative flex-shrink-0">
                <MessageAvatar senderId={message.senderId} senderName={message.senderName} />
                {onlineUsers.has(message.senderId) && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                )}
              </div>
            )}

            <div className={`max-w-xs lg:max-w-md relative ${message.senderId === user?.id ? 'order-first' : ''}`}>
              <div className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${message.senderId === user?.id
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white ml-auto rounded-br-md'
                  : 'bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-600/50 rounded-bl-md'
                } ${message.deleted ? 'italic opacity-60' : ''}`}>
                <p className="text-sm leading-relaxed">{message.content}</p>

                {!message.deleted && canDeleteMessage(message) && (
                  <button
                    onClick={() => deleteMessage(message.id || message._id)}
                    disabled={deletingMessage === (message.id || message._id)}
                    className={`absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110 ${message.senderId === user?.id
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                        : 'bg-red-100 hover:bg-red-200 text-red-600 border border-red-200'
                      } ${deletingMessage === (message.id || message._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Delete message"
                  >
                    {deletingMessage === (message.id || message._id) ? (
                      <svg className="w-3 h-3 animate-spin mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : '×'}
                  </button>
                )}
              </div>

              <div className={`text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2 ${message.senderId === user?.id ? 'justify-end' : ''
                }`}>
                <span className="font-medium">{message.senderName}</span>
                <span>•</span>
                <span>{formatTime(message.timestamp || message.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}

        {typingUsers.size > 0 && (
          <div className="flex gap-4 animate-fade-in">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-4 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium">{Array.from(typingUsers).join(', ')}</span> {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;