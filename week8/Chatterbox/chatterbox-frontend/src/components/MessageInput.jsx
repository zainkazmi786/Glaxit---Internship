// src/components/MessageInput.js
import React, { useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
const MessageInput = ({ room }) => {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !attachedFile) || !socket || !room) return;

    const roomId = room.id;

    setIsUploading(true);

    try {
      // If there's an attached file, upload it first
      if (attachedFile) {
        const uploaded = await handleFileUpload(attachedFile);
        
        // Determine file type
        const fileType = uploaded.type.startsWith('image/') ? 'image'
                       : uploaded.type.startsWith('video/') ? 'video'
                       : 'file';

        // Send file message
          console.log('Sending file message:', message.trim());
        socket.emit('sendMessage', {
          roomId,
          type: fileType,
          url: uploaded.url,
          filename: uploaded.filename,
          content: message || ' ', // Include text with file if provided
          senderId: user.id,
          timestamp: Date.now()
        });
      } else {
        console.log('Sending text message:', message.trim());
        // Send text message only
        socket.emit('sendMessage', {
          roomId,
          content: message.trim(),
          type: 'text'
        });
      }

      // Reset form
      setMessage('');
      setAttachedFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      clearTimeout(typingTimeoutRef.current);
      socket.emit('stopTyping', { roomId });

    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (!socket || !room) return;

    const roomId = room.id;

    // Emit typing event
    socket.emit('typing', { roomId });

    // Clear existing timeout
    clearTimeout(typingTimeoutRef.current);

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { roomId });
    }, 2000);
  };

const handleFileUpload = async (file) => {
  // Check if the file is a PDF by MIME type or file extension
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    alert('PDF files are not supported.');
    return; // Exit the function early, do not upload
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error; // rethrow or handle it appropriately
  }
};


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getPlaceholderText = () => {
    if (room.isDM) {
      if (room.members) {
        const otherUser = room.members.find(member => member._id !== user?.id);
        return `Message ${otherUser?.name || 'user'}...`;
      }
      return 'Type a message...';
    }
    return `Message ${room.name}...`;
  };

  if (!room) return null;

  return (
    <div className="p-6 bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50">
      {/* Show attached file preview */}
      {attachedFile && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                {attachedFile.name}
              </span>
              <span className="text-xs text-blue-500 dark:text-blue-400">
                ({(attachedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <button
              type="button"
              onClick={removeAttachedFile}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Remove attachment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={sendMessage} className="flex gap-4 items-end">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder={attachedFile ? "Add a message (optional)..." : getPlaceholderText()}
            className="w-full p-4 pl-12 pr-12 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200 hover:shadow-xl"
          />
          
          {/* File upload button */}
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isUploading}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              attachedFile 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'
            }`}
            title="Attach file"
          >
            {isUploading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            )}
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            disabled={isUploading}
          />

          {/* Status indicator */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <button
          type="submit"
          disabled={(!message.trim() && !attachedFile) || isUploading}
          className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white p-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      {/* Upload progress indicator */}
      {isUploading && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Sending message...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;