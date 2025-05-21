from flask import Blueprint, request, jsonify
from bson import json_util
import json
from app.categories.models import Category

categories_bp = Blueprint('categories', __name__)

# Helper function to convert ObjectId to string
def parse_json(data):
    return json.loads(json_util.dumps(data))

@categories_bp.route('/', methods=['GET'])
def get_categories():
    categories = Category.get_all()
    return jsonify(parse_json(categories))

@categories_bp.route('/<category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.get_by_id(category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404
    
    return jsonify(parse_json(category))

@categories_bp.route('/', methods=['POST'])
def create_category():
    data = request.get_json()
    category_id = Category.create(data)
    return jsonify({"id": category_id, "message": "Category created successfully"}), 201

@categories_bp.route('/<category_id>', methods=['PUT'])
def update_category(category_id):
    data = request.get_json()
    success = Category.update(category_id, data)
    if not success:
        return jsonify({"error": "Category not found or could not be updated"}), 404
    
    return jsonify({"message": "Category updated successfully"})

@categories_bp.route('/<category_id>', methods=['DELETE'])
def delete_category(category_id):
    success, message = Category.delete(category_id)
    if not success:
        return jsonify({"error": message}), 400
    
    return jsonify({"message": message})