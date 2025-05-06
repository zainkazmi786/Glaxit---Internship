import os

def create_folder_structure(base_path):
    # Define the folder structure
    folders = [
        "app",
        "app/static",
        "app/templates",
        "app/routes",
        "app/models",
        "app/controllers",
        "app/utils",
        "config",
        "logs",
        "tests"
    ]
    
    # Create each folder in the list
    for folder in folders:
        path = os.path.join(base_path, folder)
        try:
            os.makedirs(path, exist_ok=True)  # `exist_ok=True` prevents errors if the folder already exists
            print(f"Created folder: {path}")
        except Exception as e:
            print(f"Error creating folder {path}: {e}")

# Specify the base directory where the folder structure should be created
base_directory = os.getcwd()

# Call the function to create the folder structure
create_folder_structure(base_directory)
