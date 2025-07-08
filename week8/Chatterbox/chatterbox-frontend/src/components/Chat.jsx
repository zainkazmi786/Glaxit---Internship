// src/components/Chat.js
import React, { useState } from 'react';
import Layout from './Layout';
import RoomList from './RoomList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleRoomSelect = (room) => {
    setCurrentRoom({
      id: room._id,
      name: room.name,
      type: 'room',
      isDM: room.isDM || false,
      members: room.members || [],
      admins: room.admins || [],
      isPrivate: room.isPrivate
    });
    // Close sidebar on mobile after selecting a room
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Layout onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="h-screen flex pt-16 md:pt-20">
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <div className={`
            fixed md:relative top-16 md:top-0 left-0 z-40 h-full
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[440px] md:translate-x-0'}
            w-80 md:w-auto
          `}>
            <RoomList
              onRoomSelect={handleRoomSelect}
              currentRoom={currentRoom}
            />
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-l border-slate-200/50 dark:border-slate-700/50 md:border-l-0">
            {/* Mobile Room Header */}
            {currentRoom && (
              <div className="md:hidden flex items-center justify-between p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 mt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="font-semibold text-slate-800 dark:text-slate-200 overflow-hidden  overflow-ellipsis w-70 md:w-full">
                      {currentRoom.name}
                    </h2>
                    {currentRoom.members && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {currentRoom.members.length} members
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Messages Area */}
            <div className="flex-1 overflow-hidden rounded-tl-none md:rounded-tl-2xl shadow-inner">
              {currentRoom ? (
                <MessageList room={currentRoom} />
              ) : (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <div className="max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Welcome to ChatterBox
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Select a room from the sidebar to start chatting
                    </p>
                    <button
                      onClick={toggleSidebar}
                      className="md:hidden px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Browse Rooms
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            {currentRoom && (
              <div className="border-t border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <MessageInput room={currentRoom} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;