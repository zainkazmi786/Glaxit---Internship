from flask import Blueprint, request, jsonify
from bson import ObjectId, json_util
import json
from werkzeug.utils import secure_filename
import os
from app import mongo
from app.products.models import Product
from app.utils.helpers import allowed_file
from flask import current_app


products_bp = Blueprint('products', __name__)

# Helper function to convert ObjectId to string
def parse_json(data):
    return json.loads(json_util.dumps(data))

@products_bp.route('/', methods=['GET'])
def get_products():
    limit = int(request.args.get('limit', 20))
    skip = int(request.args.get('skip', 0))
    category_id = request.args.get('category_id')
    search = request.args.get('search')
    
    if category_id:
        products = Product.get_by_category(category_id, limit, skip)
    elif search:
        products = Product.search(search, limit, skip)
    else:
        products = Product.get_all(limit, skip)
    
    return jsonify(parse_json(products))

@products_bp.route('/bulk', methods=['POST'])
def get_products_bulk():
    data = request.get_json()
    ids = data.get('ids', [])
    if not ids:
        return jsonify([])

    from bson import ObjectId
    object_ids = [ObjectId(id) for id in ids]
    products = mongo.db.products.find({"_id": {"$in": object_ids}})
    return jsonify(parse_json(products))

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.get_by_id(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    return jsonify(parse_json(product))

@products_bp.route('/', methods=['POST'])
def create_product():
    data = request.get_json()
    
    # Handle image upload if present
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            data['image_url'] = f'/static/uploads/{filename}'
    
    product_id = Product.create(data)
    return jsonify({"id": product_id, "message": "Product created successfully"}), 201

@products_bp.route('/<product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    
    # Handle image upload if present
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            data['image_url'] = f'/static/uploads/{filename}'
    
    success = Product.update(product_id, data)
    if not success:
        return jsonify({"error": "Product not found or could not be updated"}), 404
    
    return jsonify({"message": "Product updated successfully"})

@products_bp.route('/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    success = Product.delete(product_id)
    if not success:
        return jsonify({"error": "Product not found or could not be deleted"}), 404
    
    return jsonify({"message": "Product deleted successfully"})