// src/components/MessageList.js
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import MessageAvatar from './MessageAvatar';
import Spinner from './Spinner';

const MessageList = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [deletingMessage, setDeletingMessage] = useState(null);
  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  const [isloading, setisloading] = useState(true);
  const messagesEndRef = useRef(null);

  // File download utility function
  const downloadFile = async (fileUrl, filename, fileType) => {
    try {
      const extension = filename.split('.').pop().toLowerCase();
      
      // Special handling for PDFs
      if (extension === 'pdf' || fileType === 'application/pdf') {
        // For PDFs, we want to open them in a new tab for viewing
        // but also provide download option
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Check if user wants to download or view
        const userWantsDownload = confirm('Would you like to download this PDF? (Cancel to view in browser)');
        
        if (userWantsDownload) {
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Just open in new tab for viewing
          window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
        return;
      }
      
      // For other raw files (documents), force download
      if (fileType && !fileType.startsWith('image/') && !fileType.startsWith('video/')) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For images/videos, just open in new tab
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback - just open the URL
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Get file icon based on file type
  const getFileIcon = (filename, fileType) => {
    const extension = filename.split('.').pop().toLowerCase();
    
    if (extension === 'pdf' || fileType === 'application/pdf') {
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (['doc', 'docx'].includes(extension)) {
      return (
        <svg className="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (extension === 'txt') {
      return (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
    );
  };

  // Handle file click
  const handleFileClick = (message) => {
    if (message.type === 'file' || message.type === 'document') {
      downloadFile(message.url, message.filename, message.fileType || message.type);
    } else if (message.type === 'image') {
      window.open(message.url, '_blank', 'noopener,noreferrer');
    }
  };

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

      return () => {
        socket.off('receiveMessage', handleNewMessage);
        socket.off('typing', handleTyping);
        socket.off('stopTyping', handleStopTyping);
        socket.off('messageDeleted', handleMessageDeleted);
      };
    }
  }, [socket, room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!room) return;

    try {
      setisloading(true);
      const response = await api.get(`/api/messages/${room.id}`);
      console.log('Fetched messages:', response.data);
      setMessages(response.data);
      setisloading(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const joinRoom = () => {
    if (socket && room) {
      const roomId = room.id;

      socket.emit('joinRoom', { roomId });
      
    }
  };

  const handleNewMessage = (message) => {
    const roomId =  room.id;
    if (message.roomId === roomId) {
      setMessages(prev => [...prev, message]);
    }
  };

  const handleTyping = (data) => {
    const roomId = room.id;
    if (data.roomId === roomId && data.userId !== user?.id) {
      setTypingUsers(prev => new Set(prev).add(data.userName));
    }
  };

  const handleStopTyping = (data) => {
    const roomId = room.id;
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
  if (isloading) {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b mt-[12px] md:h-[79vh] h-[72vh] from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-sm">
      <Spinner />
    </div>
  );
}

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b mt-[12px] md:h-[79vh] h-[72vh] from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-sm">
      <div className="p-6 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm hidden md:block">
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
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl  border-blue-200/50 dark:border-blue-700/50">
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

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar max-h-[77vh] md:max-h-[70vh]">
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

            <div className={`relative ${message.senderId === user?.id ? 'order-first' : ''}`}>
              <div className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${message.senderId === user?.id
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white ml-auto rounded-br-md '
                  : 'bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-600/50 rounded-bl-md'
                } ${message.deleted ? 'opacity-50 italic' : ''}`}>

               

                {!message.deleted && message.type === 'image' && (
                  <img 
                    src={message.url} 
                    alt={message.filename || "image"} 
                    className="max-w-xs rounded cursor-pointer hover:opacity-90 transition-opacity" 
                    onClick={() => handleFileClick(message)}
                  />
                )}

                {!message.deleted && message.type === 'video' && (
                  <video src={message.url} controls className="max-w-xs rounded" />
                )}

                {(!message.deleted && (message.type === 'file' || message.type === 'document')) && (
                  <div 
                    className="file-attachment cursor-pointer p-3 border border-slate-200/50  rounded-lg  hover:bg-slate-50/50 dark:hover:bg-slate-600/50 transition-colors"
                    onClick={() => handleFileClick(message)}
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(message.filename, message.fileType)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{message.filename}</div>
                        <div className="text-xs text-slate-200 ">
                          {message.filename.split('.').pop().toUpperCase()} • Click to {message.filename.endsWith('.pdf') ? 'view' : 'download'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!message.deleted && (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
                {message.deleted && (
                <p className="text-sm italic text-slate-100">This message has been deleted</p>
                )}

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