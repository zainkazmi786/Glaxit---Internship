from datetime import datetime
from bson import ObjectId
from app import mongo

class Category:
    @staticmethod
    def get_all():
        return list(mongo.db.categories.find())
    
    @staticmethod
    def get_by_id(category_id):
        try:
            return mongo.db.categories.find_one({"_id": ObjectId(category_id)})
        except:
            return None
    
    @staticmethod
    def create(category_data):
        category_data['created_at'] = datetime.utcnow()
        category_data['updated_at'] = datetime.utcnow()
        result = mongo.db.categories.insert_one(category_data)
        return str(result.inserted_id)
    
    @staticmethod
    def update(category_id, category_data):
        category_data['updated_at'] = datetime.utcnow()
        result = mongo.db.categories.update_one(
            {"_id": ObjectId(category_id)},
            {"$set": category_data}
        )
        return result.modified_count > 0
    
    @staticmethod
    def delete(category_id):
        # First check if any products use this category
        products_count = mongo.db.products.count_documents({"category_id": ObjectId(category_id)})
        if products_count > 0:
            return False, "Cannot delete category with associated products"
        
        result = mongo.db.categories.delete_one({"_id": ObjectId(category_id)})
        return result.deleted_count > 0, "Category successfully deleted"