import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../utils/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';    
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select , SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Posts Management Component
const PostsManagement = () => {
  const [editingPostId, setEditingPostId] = useState(null);
  const [postForm, setPostForm] = useState({ title: '', content: '', status: 'published' });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission ,user} = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Add success state

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await apiCall('/posts?page=1&limit=50');
      console.log('Fetched posts:', data.data.posts);
      setPosts(data.data.posts || data.data);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
    setLoading(false);
  };

  // Handle form input changes
  const handleChange = (field, value) => {
    setPostForm(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null); // Clear success message on form change
  };

  // Start editing a post: populate form and set editingPostId
  const startEditing = (post) => {
    if (!hasPermission('edit_post')) return;
    setEditingPostId(post._id);
    setPostForm({ title: post.title, content: post.content, status: post.status });
    setError(null);
    setSuccess(null); // Clear success message
  };

  // Cancel editing: reset form and editingPostId
  const cancelEditing = () => {
    setEditingPostId(null);
    setPostForm({ title: '', content: '', status: 'published' });
    setError(null);
     setSuccess(null); // Clear success message
  };

    // Input validation function
  const validatePostForm = (form) => {
    const errors = {};
    if (!form.title || form.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    if (!form.content || form.content.trim().length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }
    return errors;
  };

  // Create a new post
  const createPost = async () => {
    if (!hasPermission('create_post')) return;

     const errors = validatePostForm(postForm);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors).join(', '));
      return;
    }

    try {
      await apiCall('/posts', {
        method: 'POST',
        body: JSON.stringify(postForm),
      });
      setPostForm({ title: '', content: '', status: 'published' });
      fetchPosts();
      setSuccess('Post created successfully!'); // Add success message
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  // Update existing post
  const updatePost = async () => {
    if (!hasPermission('edit_post')) return;

    const errors = validatePostForm(postForm);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors).join(', '));
      return;
    }

    try {
      await apiCall(`/posts/${editingPostId}`, {
        method: 'PUT',
        body: JSON.stringify(postForm),
      });
      cancelEditing();
      fetchPosts();
       setSuccess('Post updated successfully!'); // Add success message
      setError(null);
    } catch (error) {
      setError(error.message);
       setSuccess(null);
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    if (!hasPermission('delete_post')) return;
    try {
      await apiCall(`/posts/${postId}`, { method: 'DELETE' });
      fetchPosts();
      setSuccess('Post deleted successfully!'); // Add success message
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Posts Management</h1>
      
       {success && (
        <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-2 duration-300 mb-4 mx-4">
          <AlertDescription className="text-green-700 font-medium">{success}</AlertDescription>
        </Alert>
      )}

      {(hasPermission('create_post') || editingPostId) && (
        <Card className="mb-6 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          {error && (
            <Alert className="mb-4 mx-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-500">{error}</AlertDescription>
            </Alert>
          )}
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{editingPostId ? 'Update Post' : 'Create New Post'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Post title"
              value={postForm.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
            />
            <Textarea
              placeholder="Post content"
              value={postForm.content}
              onChange={(e) => handleChange('content', e.target.value)}
                className="transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
            />
            <Select value={postForm.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger className="transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              {editingPostId ? (
                <>
                  <Button
                    onClick={updatePost}
                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    disabled={!postForm.title.trim() || !postForm.content.trim()}
                  >
                    Update Post
                  </Button>
                  <Button variant="outline" onClick={cancelEditing}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={createPost}
                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  disabled={!postForm.title.trim() || !postForm.content.trim()}
                >
                  Create Post
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {posts.map(post => (
          <Card key={post._id} className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <h3 className="font-semibold">{post.author?.name || 'Unknown Author'}</h3>
                <p className="text-gray-600 mt-2">{post.content}</p>
                <Badge variant="outline" className="mt-2">{post.status}</Badge>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {(hasPermission('edit_all_posts') || 
                (hasPermission('edit_post') && post.author._id === user.user._id)) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => startEditing(post)}
                >
                  Edit
                </Button>
              )}

              {/* Delete Button */}
              {(hasPermission('delete_all_posts') || 
                (hasPermission('delete_post') && post.author._id === user.user._id)) && (
                <Button
                  onClick={() => deletePost(post._id)}
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

export default PostsManagement;
