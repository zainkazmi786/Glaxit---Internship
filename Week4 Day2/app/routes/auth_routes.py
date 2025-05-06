from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
import jwt
import datetime
from bson.objectid import ObjectId
from config import Config
from app import mongo  # assuming `mongo = PyMongo(app)` in your main app


auth_bp = Blueprint("auth", __name__)

# USER REGISTRATION
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if mongo.db.users.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = generate_password_hash(password)

    user_id = mongo.db.users.insert_one({
        'name': name,
        'email': email,
        'password': hashed_password,
        'created_at': datetime.datetime.utcnow()
    }).inserted_id

    return jsonify({'message': 'User registered successfully', 'user_id': str(user_id)}), 201


# USER LOGIN
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = mongo.db.users.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, Config.JWT_SECRET_KEY, algorithm='HS256')

    return jsonify({'token': token}), 200
