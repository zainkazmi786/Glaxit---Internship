import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Enhanced Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowLogoutAlert(true);
    
    setTimeout(() => {
      logout();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome to your personalized workspace</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            disabled={isLoggingOut}
            className="bg-white/80 border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 shadow-sm"
          >
            {isLoggingOut ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-2"></div>
                Logging out...
              </div>
            ) : (
              'Logout'
            )}
          </Button>
        </div>

        {/* Logout Alert */}
        {showLogoutAlert && (
          <Alert className="mb-6 border-blue-200 bg-blue-50 animate-in slide-in-from-top-2 duration-300">
            <AlertDescription className="text-blue-700 font-medium">
              Logging out... See you soon!
            </AlertDescription>
          </Alert>
        )}
        
        {/* User Profile Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-800">
                  Welcome back, {user?.user?.name || 'User'}!
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  {user?.user?.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Roles Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <strong className="text-gray-800 font-semibold">Your Roles</strong>
              </div>
              <div className="flex gap-2 flex-wrap">
                {user?.user?.roles?.length > 0 ? (
                  user.user.roles.map(role => (
                    <Badge 
                      key={role.id} 
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 px-3 py-1 font-medium"
                    >
                      {role.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full text-sm">
                    No roles assigned
                  </span>
                )}
              </div>
            </div>

            {/* Permissions Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <strong className="text-gray-800 font-semibold">Your Permissions</strong>
              </div>
              <div className="flex gap-2 flex-wrap">
                {user?.permissions?.length > 0 ? (
                  user.permissions.map(permission => (
                    <Badge 
                      key={permission} 
                      variant="outline"
                      className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 px-3 py-1 font-medium"
                    >
                      {permission}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full text-sm">
                    No permissions assigned
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Roles</p>
                  <p className="text-3xl font-bold">{user?.user?.roles?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Permissions</p>
                  <p className="text-3xl font-bold">{user?.permissions?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔐</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Account Status</p>
                  <p className="text-lg font-bold">Active</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Explore the features available to you based on your current roles and permissions.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span>Secure Access</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Role-Based Permissions</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Real-time Updates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;