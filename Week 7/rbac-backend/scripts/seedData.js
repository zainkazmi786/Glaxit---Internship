
// ===== scripts/seedData.js =====
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Permission = require('../models/permissionModel');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});

    console.log('Cleared existing data');

    // Create Permissions
    const permissions = await Permission.insertMany([
      { name: 'create_post', description: 'Create new posts' },
      { name: 'edit_post', description: 'Edit own posts' },
      { name: 'delete_post', description: 'Delete own posts' },
      { name: 'edit_all_posts', description: 'Edit all posts' },
      { name: 'delete_all_posts', description: 'Delete all posts' },
      { name: 'manage_users', description: 'Manage user accounts' },
      { name: 'manage_roles', description: 'Manage roles and assignments' },
      { name: 'manage_permissions', description: 'Manage permissions' },
      { name: 'view_analytics', description: 'View system analytics' },
      { name: 'system_settings', description: 'Modify system settings' }
    ]);

    console.log('Created permissions');

    // Create Roles
    const adminRole = new Role({
      name: 'Admin',
      description: 'Full system access',
      permissionIds: permissions.map(p => p._id) // All permissions
    });

    const editorRole = new Role({
      name: 'Editor',
      description: 'Content management access',
      permissionIds: permissions
        .filter(p => ['create_post', 'edit_post', 'delete_post', 'edit_all_posts', 'delete_all_posts'].includes(p.name))
        .map(p => p._id)
    });

    const userRole = new Role({
      name: 'User',
      description: 'Basic user access',
      permissionIds: permissions
        .filter(p => ['create_post', 'edit_post', 'delete_post'].includes(p.name))
        .map(p => p._id)
    });

    await Role.insertMany([adminRole, editorRole, userRole]);
    console.log('Created roles');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      roles: [adminRole._id]
    });

    const editorUser = new User({
      name: 'Editor User',
      email: 'editor@example.com',
      password: hashedPassword,
      roles: [editorRole._id]
    });

    const regularUser = new User({
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      roles: [userRole._id]
    });

    await User.insertMany([adminUser, editorUser, regularUser]);
    console.log('Created users');

    console.log('\n=== SEED DATA COMPLETE ===');
    console.log('Test Accounts:');
    console.log('Admin: admin@example.com / password123');
    console.log('Editor: editor@example.com / password123');
    console.log('User: user@example.com / password123');
    console.log('\nPermissions created:', permissions.length);
    console.log('Roles created: Admin, Editor, User');
    console.log('Users created: 3');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
