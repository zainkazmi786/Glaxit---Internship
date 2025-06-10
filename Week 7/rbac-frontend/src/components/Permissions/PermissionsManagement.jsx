import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../utils/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';    
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PermissionsManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Add success state
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const data = await apiCall('/permissions');
      console.log('Fetched permissions:', data);
      setPermissions(data.data.permissions || data.permissions);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching permissions:', error);
    }
    setLoading(false);
  };

   // Input validation function
  const validatePermissionForm = (form) => {
    const errors = {};
    if (!form.name || form.name.trim().length < 3) {
      errors.name = 'Permission name must be at least 3 characters';
    }
    if (!form.description || form.description.trim().length < 10) {
      errors.description = 'Permission description must be at least 10 characters';
    }
    return errors;
  };

  const createPermission = async () => {
    if (!isAdmin()) return;

    const errors = validatePermissionForm(newPermission);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors).join(', '));
      return;
    }

    try {
      await apiCall('/permissions', {
        method: 'POST',
        body: JSON.stringify(newPermission)
      });
      setNewPermission({ name: '', description: '' });
      fetchPermissions();
      setSuccess('Permission created successfully!'); // Add success message
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  const deletePermission = async (permissionId) => {
    if (!isAdmin()) return;
    try {
      await apiCall(`/permissions/${permissionId}`, { method: 'DELETE' });
      fetchPermissions();
      setSuccess('Permission deleted successfully!'); // Add success message
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Permission Management</h1>
      
      {success && (
        <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-2 duration-300 mb-4 mx-4">
          <AlertDescription className="text-green-700 font-medium">{success}</AlertDescription>
        </Alert>
      )}

      {isAdmin() && (
        <Card className="mb-6 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create New Permission</CardTitle>
          </CardHeader>
           {error && (
            <Alert className="mb-4 mx-4 border-red-200 bg-red-50">
              <AlertDescription className={"text-red-500"}>{error}</AlertDescription>
            </Alert>
           )}
          <CardContent className="space-y-4">
            <Input
              placeholder="Permission name"
              value={newPermission.name}
              onChange={(e) => setNewPermission({...newPermission, name: e.target.value})}
               className="transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
            />
            <Textarea
              placeholder="Permission description"
              value={newPermission.description}
              onChange={(e) => setNewPermission({...newPermission, description: e.target.value})}
              className="transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
            />
            <Button 
             className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            onClick={createPermission}>Create Permission</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {permissions.map(permission => (
          <Card key={permission._id} className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{permission.name}</h3>
                  <p className="text-gray-600">{permission.description}</p>
                </div>
                {isAdmin() && (
                  <Button
                    onClick={() => deletePermission(permission._id)}
                    variant="destructive"
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PermissionsManagement;
