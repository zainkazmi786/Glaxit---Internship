import os

# Define the folder and file structure
structure = {
    "chatterbox-backend": {
        "controllers": ["authController.js", "messageController.js", "roomController.js"],
        "models": ["User.js", "Room.js", "Message.js"],
        "routes": ["auth.js", "messages.js", "rooms.js"],
        "sockets": ["index.js"],
        "middleware": ["jwtAuth.js", "socketAuth.js"],
        "config": ["db.js", "passport.js"],
        "": [".env", "app.js", "server.js", "package.json"]
    }
}

def create_structure(base_path, structure):
    for folder, contents in structure.items():
        folder_path = os.path.join(base_path, folder)
        os.makedirs(folder_path, exist_ok=True)
        for subfolder, files in contents.items():
            subfolder_path = os.path.join(folder_path, subfolder)
            if subfolder:  # If not empty string
                os.makedirs(subfolder_path, exist_ok=True)
            for file in files:
                file_path = os.path.join(subfolder_path if subfolder else folder_path, file)
                with open(file_path, 'w') as f:
                    f.write("")  # Create empty file

# Run the script
create_structure(".", structure)

print("Project structure created successfully.")
