
// ===== controllers/roleController.js =====
const Role = require('../models/roleModel');
const Permission = require('../models/permissionModel');
const Joi = require('joi');

// Validation schema
const roleSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().min(5).max(200).required(),
  permissionIds: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
});

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { roles }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      data: { role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new role (Admin only)
const createRole = async (req, res) => {
  try {
    const { error } = roleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, description, permissionIds = [] } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role already exists with this name'
      });
    }

    // Verify all permission IDs exist
    if (permissionIds.length > 0) {
      const permissions = await Permission.find({ _id: { $in: permissionIds } });
      if (permissions.length !== permissionIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more permission IDs are invalid'
        });
      }
    }

    const role = new Role({
      name,
      description,
      permissionIds
    });

    await role.save();

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: { role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update role (Admin only)
const updateRole = async (req, res) => {
  try {
    const { error } = roleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, description, permissionIds = [] } = req.body;

    // Verify all permission IDs exist
    if (permissionIds.length > 0) {
      const permissions = await Permission.find({ _id: { $in: permissionIds } });
      if (permissions.length !== permissionIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more permission IDs are invalid'
        });
      }
    }

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description, permissionIds },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: { role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete role (Admin only)
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    if (role.name.toLowerCase() === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete Admin role'
      });
    }

    await role.deleteOne(); // or Role.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Assign permission to role (Admin only)
const assignPermission = async (req, res) => {
  try {
    const { permissionId } = req.body;
    
    const role = await Role.findById(req.params.id);
    const permission = await Permission.findById(permissionId);

    if (!role || !permission) {
      return res.status(404).json({
        success: false,
        message: 'Role or permission not found'
      });
    }

    if (role.permissionIds.includes(permissionId)) {
      return res.status(400).json({
        success: false,
        message: 'Role already has this permission'
      });
    }

    role.permissionIds.push(permissionId);
    await role.save();

    res.json({
      success: true,
      message: 'Permission assigned to role successfully',
      data: { role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Remove permission from role (Admin only)
const removePermission = async (req, res) => {
  try {
    const { permissionId } = req.body;
    
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    role.permissionIds = role.permissionIds.filter(
      pId => pId.toString() !== permissionId
    );
    await role.save();

    res.json({
      success: true,
      message: 'Permission removed from role successfully',
      data: { role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermission,
  removePermission
};