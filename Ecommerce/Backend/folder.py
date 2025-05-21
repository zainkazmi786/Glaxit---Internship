import os

# Define folder and file structure
structure = {
    "ecommerce_backend": [
        "app.py",
        "config.py",
        "requirements.txt",
        "utils/__init__.py",
        "api/__init__.py",
        "api/products/__init__.py",
        "api/products/models.py",
        "api/products/routes.py",
        "api/categories/__init__.py",
        "api/categories/models.py",
        "api/categories/routes.py",
        "api/orders/__init__.py",
        "api/orders/models.py",
        "api/orders/routes.py",
        "api/contact/__init__.py",
        "api/contact/models.py",
        "api/contact/routes.py",
        "api/payments/__init__.py",
        "api/payments/routes.py"
    ]
}

# Create folders and files
for root, files in structure.items():
    for path in files:
        full_path = os.path.join(root, path)
        folder = os.path.dirname(full_path)
        os.makedirs(folder, exist_ok=True)
        with open(full_path, "w") as f:
            f.write("")  # Empty file

print("✅ Project structure created successfully.")
