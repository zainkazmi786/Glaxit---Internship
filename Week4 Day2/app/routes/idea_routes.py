from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from datetime import datetime
from app import mongo
from app.utils.auth import token_required

idea_bp = Blueprint("ideas", __name__)

# CREATE a new idea
@idea_bp.route('/ideas', methods=['POST'])
@token_required
def create_idea(user_id):
    data = request.get_json()
    title = data.get('title')
    category = data.get('category')
    description = data.get('description')

    if not title or not category or not description:
        return jsonify({'error': 'All fields are required'}), 400

    idea = {
        'user_id': user_id,
        'title': title,
        'category': category,
        'description': description,
        'timestamp': datetime.utcnow()
    }

    result = mongo.db.ideas.insert_one(idea)
    return jsonify({'message': 'Idea added', 'id': str(result.inserted_id)}), 201

# GET all ideas for the logged-in user
@idea_bp.route('/ideas', methods=['GET'])
@token_required
def get_user_ideas(user_id):
    ideas = list(mongo.db.ideas.find({'user_id': user_id}))
    for idea in ideas:
        idea['_id'] = str(idea['_id'])
        idea['timestamp'] = idea['timestamp'].isoformat()

    return jsonify(ideas), 200

# GET a random idea (from all users, or only user's own)
@idea_bp.route('/ideas/random', methods=['GET'])
@token_required
def get_random_idea(user_id):
    # Get a random idea from the user's own ideas
    pipeline = [
        {'$match': {'user_id': user_id}},
        {'$sample': {'size': 1}}
    ]
    result = list(mongo.db.ideas.aggregate(pipeline))

    if not result:
        return jsonify({'error': 'No ideas found'}), 404

    idea = result[0]
    idea['_id'] = str(idea['_id'])
    idea['timestamp'] = idea['timestamp'].isoformat()

    return jsonify(idea), 200

@idea_bp.route('/ideas/<id>', methods=['GET'])
@token_required
def get_idea(user_id, id):
    idea = mongo.db.ideas.find_one({'_id': ObjectId(id), 'user_id': user_id})
    if not idea:
        return jsonify({'error': 'Idea not found or not authorized'}), 404

    idea['_id'] = str(idea['_id'])
    return jsonify(idea), 200
# UPDATE an idea by ID
@idea_bp.route('/ideas/<id>', methods=['PUT'])
@token_required
def update_idea(user_id, id):
    data = request.get_json()
    title = data.get('title')
    category = data.get('category')
    description = data.get('description')

    update_data = {}
    if title: update_data['title'] = title
    if category: update_data['category'] = category
    if description: update_data['description'] = description

    if not update_data:
        return jsonify({'error': 'No fields to update'}), 400

    result = mongo.db.ideas.update_one(
        {'_id': ObjectId(id), 'user_id': user_id},
        {'$set': update_data}
    )

    if result.matched_count == 0:
        return jsonify({'error': 'Idea not found or not authorized'}), 404

    return jsonify({'message': 'Idea updated successfully'}), 200

# DELETE an idea by ID
@idea_bp.route('/ideas/<id>', methods=['DELETE'])
@token_required
def delete_idea(user_id, id):
    result = mongo.db.ideas.delete_one({
        '_id': ObjectId(id),
        'user_id': user_id
    })

    if result.deleted_count == 0:
        return jsonify({'error': 'Idea not found or not authorized'}), 404

    return jsonify({'message': 'Idea deleted successfully'}), 200
