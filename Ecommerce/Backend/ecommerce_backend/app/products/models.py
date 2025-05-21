from datetime import datetime
from bson import ObjectId
from app import mongo

class Product:
    @staticmethod
    def get_all(limit=100, skip=0):
        return list(mongo.db.products.find().skip(skip).limit(limit))
    
    @staticmethod
    def get_by_id(product_id):
        try:
            return mongo.db.products.find_one({"_id": ObjectId(product_id)})
        except:
            return None
    
    @staticmethod
    def get_by_category(category_id, limit=100, skip=0):
        try:
            return list(mongo.db.products.find(
                {"category_id": ObjectId(category_id)}
            ).skip(skip).limit(limit))
        except:
            return []
    
    @staticmethod
    def create(product_data):
        product_data['created_at'] = datetime.utcnow()
        product_data['updated_at'] = datetime.utcnow()
        
        # Convert category_id to ObjectId if provided
        if 'category_id' in product_data and product_data['category_id']:
            product_data['category_id'] = ObjectId(product_data['category_id'])
            
        result = mongo.db.products.insert_one(product_data)
        return str(result.inserted_id)
    
    @staticmethod
    def update(product_id, product_data):
        product_data['updated_at'] = datetime.utcnow()
        
        # Convert category_id to ObjectId if provided
        if 'category_id' in product_data and product_data['category_id']:
            product_data['category_id'] = ObjectId(product_data['category_id'])
            
        result = mongo.db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": product_data}
        )
        return result.modified_count > 0
    
    @staticmethod
    def delete(product_id):
        result = mongo.db.products.delete_one({"_id": ObjectId(product_id)})
        return result.deleted_count > 0
    
    @staticmethod
    def search(query, limit=100, skip=0):
        return list(mongo.db.products.find(
            {"$text": {"$search": query}}
        ).skip(skip).limit(limit))