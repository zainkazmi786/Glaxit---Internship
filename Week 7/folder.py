import os

# Define folder and their respective files
structure = {
    "rbac-backend/controllers": [
        "authController.js",
        "roleController.js",
        "userController.js"
    ],
    "rbac-backend/middlewares": [
        "authMiddleware.js",
        "permissionMiddleware.js"
    ],
    "rbac-backend/models": [
        "userModel.js",
        "roleModel.js",
        "permissionModel.js"
    ],
    "rbac-backend/routes": [
        "authRoutes.js",
        "roleRoutes.js",
        "userRoutes.js"
    ],
    "rbac-backend/utils": [
        "jwt.js"
    ],
    "rbac-backend/config": [
        "db.js"
    ]
}

# Root-level files
root_files = [
    "rbac-backend/.env",
    "rbac-backend/app.js",
    "rbac-backend/server.js",
    "rbac-backend/package.json",
    "rbac-backend/README.md"
]

def create_structure():
    for folder, files in structure.items():
        os.makedirs(folder, exist_ok=True)
        print(f"Created folder: {folder}")
        for file in files:
            file_path = os.path.join(folder, file)
            with open(file_path, 'w') as f:
                f.write("")
            print(f"  └─ Created file: {file_path}")

    for file in root_files:
        with open(file, 'w') as f:
            f.write("")
        print(f"Created root file: {file}")

if __name__ == "__main__":
    create_structure()
