import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../utils/api';
import { Button } from '@/components/ui/button';    
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RolesManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissionIds: [] });
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin, hasPermission } = useAuth();
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
    fetchRoles();
    fetchPermissions();
  }, []);

  const validateRoleForm = () => {
    const errors = {};
    
    if (!newRole.name.trim()) {
      errors.name = 'Role name is required';
    } else if (newRole.name.trim().length < 2) {
      errors.name = 'Role name must be at least 2 characters';
    } else if (roles.some(role => role.name.toLowerCase() === newRole.name.trim().toLowerCase())) {
      errors.name = 'Role name already exists';
    }
    
    if (!newRole.description.trim()) {
      errors.description = 'Role description is required';
    } else if (newRole.description.trim().length < 10) {
      errors.description = 'Role description must be at least 10 characters';
    }
    
    if (newRole.permissionIds.length === 0) {
      errors.permissions = 'At least one permission must be selected';
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

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/roles');
      console.log('Fetched roles:', data);
      setRoles(data.data.roles || data.roles);
    } catch (error) {
      showErrorAlert(`Failed to fetch roles: ${error.message}`);
      console.error('Error fetching roles:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const data = await apiCall('/permissions');
      console.log('Fetched permissions:', data);
      setPermissions(data.data.permissions || data.permissions);
    } catch (error) {
      showErrorAlert(`Failed to fetch permissions: ${error.message}`);
      console.error('Error fetching permissions:', error.message);
    }
  };

  const createRole = async () => {
    if (!hasPermission('manage_roles')) {
      showErrorAlert('You do not have permission to create roles');
      return;
    }

    if (!validateRoleForm()) return;

    setCreateLoading(true);
    
    try {
      await apiCall('/roles', {
        method: 'POST',
        body: JSON.stringify(newRole)
      });
      
      setNewRole({ name: '', description: '', permissionIds: [] });
      setValidationErrors({});
      await fetchRoles();
      showSuccessAlert('Role created successfully!');
    } catch (error) {
      showErrorAlert(`Failed to create role: ${error.message}`);
      console.error('Error creating role:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteRole = async (roleId, roleName) => {
    if (!hasPermission('manage_roles')) {
      showErrorAlert('You do not have permission to delete roles');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiCall(`/roles/${roleId}`, { method: 'DELETE' });
      await fetchRoles();
      showSuccessAlert(`Role "${roleName}" deleted successfully!`);
    } catch (error) {
      showErrorAlert(`Failed to delete role: ${error.message}`);
      console.error('Error deleting role:', error);
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setNewRole(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  const filteredRoles = roles.filter(role =>
    role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <span className="text-lg font-medium text-gray-700">Loading roles...</span>
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
            Role Management
          </h1>
          <p className="text-gray-600">Create and manage roles with permissions</p>
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

        {/* Create New Role Form */}
        {hasPermission('manage_roles') && (
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-t-lg">
              <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Role
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Validation Errors */}
              {Object.keys(validationErrors).length > 0 && (
                <Alert className="border-red-200 bg-red-50 shadow-lg">
                  <AlertDescription className="text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {Object.values(validationErrors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Role Name */}
              <div className="space-y-2">
                <Label htmlFor="roleName" className="text-sm font-medium text-gray-700">
                  Role Name *
                </Label>
                <Input
                  id="roleName"
                  placeholder="Enter role name (e.g., Editor, Moderator)"
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  className={`transition-all duration-200 ${
                    validationErrors.name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Role Description */}
              <div className="space-y-2">
                <Label htmlFor="roleDescription" className="text-sm font-medium text-gray-700">
                  Role Description *
                </Label>
                <Textarea
                  id="roleDescription"
                  placeholder="Describe the role's purpose and responsibilities..."
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  className={`min-h-[100px] transition-all duration-200 ${
                    validationErrors.description 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {validationErrors.description && (
                  <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                    {validationErrors.description}
                  </p>
                )}
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Permissions * ({newRole.permissionIds.length} selected)
                </Label>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-lg border transition-all duration-200 ${
                  validationErrors.permissions 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  {permissions.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-4">No permissions available</p>
                  ) : (
                    permissions.map(permission => (
                      <Label key={permission._id} className="flex items-center space-x-3 p-3 rounded-md bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newRole.permissionIds.includes(permission._id)}
                          onChange={() => handlePermissionToggle(permission._id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
                        />
                        <span className="text-sm font-medium text-gray-700">{permission.name}</span>
                      </Label>
                    ))
                  )}
                </div>
                {validationErrors.permissions && (
                  <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                    {validationErrors.permissions}
                  </p>
                )}
              </div>

              <Button 
                onClick={createRole}
                disabled={createLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {createLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Creating Role...
                  </div>
                ) : (
                  'Create Role'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Search Bar */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Search Roles
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by role name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Roles Grid */}
        <div className="grid gap-6">
          {filteredRoles.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No roles found matching your search.' : 'No roles available.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRoles.map(role => (
              <Card key={role._id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{role.name}</h3>
                        <Badge 
                          variant="outline"
                          className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700"
                        >
                          {role.permissionIds?.length || 0} permissions
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{role.description}</p>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Permissions:</Label>
                        <div className="flex flex-wrap gap-2">
                          {role.permissionIds?.length > 0 ? (
                            role.permissionIds.map(permission => (
                              <Badge 
                                key={permission._id} 
                                variant="outline"
                                className="border-green-200 text-green-700 bg-green-50 hover:bg-green-100 transition-colors duration-200"
                              >
                                {permission.name}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="border-gray-300 text-gray-500 bg-gray-50">
                              No permissions assigned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {hasPermission('manage_roles') && (
                      <div className="ml-6">
                        <Button
                          onClick={() => deleteRole(role._id, role.name)}
                          variant="destructive"
                          size="sm"
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          Delete Role
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Info */}
        {!hasPermission('manage_roles') && (
          <Card className="mt-8 bg-yellow-50/80 backdrop-blur-sm border-yellow-200 shadow-lg">
            <CardContent className="p-6">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-700 font-medium">
                  You have read-only access to roles. Contact an administrator to create or modify roles.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RolesManagement;