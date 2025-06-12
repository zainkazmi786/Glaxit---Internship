import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin , hasPermission} = useAuth();
  const [dialogMode, setDialogMode] = useState('assign');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Auto-clear alerts after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => {
    if (hasPermission("manage_users")) {
      fetchUsers();
      fetchRoles();
    }
  }, []);

  const validateUserAction = (action, userId, additionalData = {}) => {
    const errors = {};
    
    if (!userId) {
      errors.userId = 'User ID is required';
    }
    
    if (action === 'assignRole' && !additionalData.roleId) {
      errors.roleId = 'Role selection is required';
    }
    
    if (action === 'removeRole' && !additionalData.roleId) {
      errors.roleId = 'Role selection is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showSuccessAlert = (message) => {
    setSuccess(message);
    setError(null);
  };

  const showErrorAlert = (message) => {
    setError(message);
    setSuccess(null);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/users?page=1&limit=50');
      setUsers(data.data.users || data.users);
      setError(null);
    } catch (error) {
      showErrorAlert(`Failed to fetch users: ${error.message}`);
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await apiCall('/roles');
      console.log('Fetched roles:', data);
      setRoles(data.data.roles || data.roles);
    } catch (error) {
      showErrorAlert(`Failed to fetch roles: ${error.message}`);
      console.error('Error fetching roles:', error.message);
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    if (!validateUserAction('updateStatus', userId)) return;

    try {
      await apiCall(`/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive })
      });
      await fetchUsers();
      showSuccessAlert(`User ${isActive ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      showErrorAlert(`Failed to update user status: ${error.message}`);
      console.error('Error updating user status:', error);
    }
  };

  const assignRole = async (userId, roleId) => {
    if (!validateUserAction('assignRole', userId, { roleId })) return;

    try {
      await apiCall('/users/assign-role', {
        method: 'POST',
        body: JSON.stringify({ userId, roleId })
      });
      await fetchUsers();
      showSuccessAlert('Role assigned successfully!');
    } catch (error) {
      showErrorAlert(`Failed to assign role: ${error.message}`);
      console.error('Error assigning role:', error);
    }
  };

  const removeRole = async (userId, roleId) => {
    if (!validateUserAction('removeRole', userId, { roleId })) return;

    try {
      await apiCall('/users/remove-role', {
        method: 'POST',
        body: JSON.stringify({ userId, roleId })
      });
      await fetchUsers();
      showSuccessAlert('Role removed successfully!');
    } catch (error) {
      showErrorAlert(`Failed to remove role: ${error.message}`);
      console.error('Error removing role:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!validateUserAction('deleteUser', userId)) return;
    
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await apiCall(`/users/${userId}`, {
        method: 'DELETE',
      });
      await fetchUsers();
      showSuccessAlert('User deleted successfully!');
    } catch (error) {
      showErrorAlert(`Failed to delete user: ${error.message}`);
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!hasPermission("manage_users")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="container mx-auto max-w-2xl">
          <Alert className="border-red-200 bg-red-50 shadow-lg">
            <AlertDescription className="text-red-700 font-medium">
              You don't have permission to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <span className="text-lg font-medium text-gray-700">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <AlertDescription className="text-red-700 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <AlertDescription className="text-green-700 font-medium">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Search Bar */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Search Users
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50 shadow-lg">
            <AlertDescription className="text-red-700">
              <ul className="list-disc list-inside space-y-1">
                {Object.values(validationErrors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Users Grid */}
        <div className="grid gap-6">
          {filteredUsers.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map(user => (
              <Card key={user._id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                        <Badge 
                          variant={user.isActive ? "default" : "secondary"}
                          className={user.isActive 
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                            : "bg-gray-200 text-gray-600"
                          }
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{user.email}</p>
                      <div className="flex flex-wrap gap-2">
                        {user.roles?.length > 0 ? (
                          user.roles.map(role => (
                            <Badge 
                              key={role._id} 
                              variant="outline"
                              className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                            >
                              {role.name}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="border-gray-300 text-gray-500 bg-gray-50">
                            No roles assigned
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => updateUserStatus(user._id, !user.isActive)}
                        variant={user.isActive ? "destructive" : "default"}
                        size="sm"
                        className={user.isActive 
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105" 
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200 transform hover:scale-105"
                        }
                      >
                        {user.isActive ? 'Disable' : 'Enable'}
                      </Button>
                     
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDialogMode('assign');
                              setSelectedUser(user);
                            }}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
                          >
                            Assign Role
                          </Button>
                        </DialogTrigger>
                        
                        <DialogContent className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              Assign Role to {user.name}
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {roles
                              ?.filter(role =>
                                !user.roles?.some(userRole => userRole._id === role._id)
                              ).length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No roles available to assign</p>
                              ) : (
                                roles
                                  ?.filter(role =>
                                    !user.roles?.some(userRole => userRole._id === role._id)
                                  )
                                  .map(role => (
                                    <Button
                                      key={role._id}
                                      onClick={() => assignRole(user._id, role._id)}
                                      variant="outline"
                                      className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 transform hover:scale-[1.02]"
                                    >
                                      {role.name}
                                    </Button>
                                  ))
                              )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDialogMode('remove');
                              setSelectedUser(user);
                            }}
                            className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 transform hover:scale-105"
                          >
                            Remove Role
                          </Button>
                        </DialogTrigger>
                        
                        <DialogContent className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                              Remove Role from {user.name}
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {user.roles?.length === 0 ? (
                              <p className="text-gray-500 text-center py-4">No roles to remove</p>
                            ) : (
                              user.roles?.map(role => (
                                <Button
                                  key={role._id}
                                  onClick={() => removeRole(user._id, role._id)}
                                  variant="outline"
                                  className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                  {role.name}
                                </Button>
                              ))
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => deleteUser(user._id)}
                        variant="destructive"
                        size="sm"
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;