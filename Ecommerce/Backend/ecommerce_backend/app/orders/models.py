from datetime import datetime
from bson import ObjectId
from app import mongo

class Order:
    @staticmethod
    def get_all(limit=100, skip=0):
        return list(mongo.db.orders.find().sort("created_at", -1).skip(skip).limit(limit))
    
    @staticmethod
    def get_by_id(order_id):
        try:
            return mongo.db.orders.find_one({"_id": ObjectId(order_id)})
        except:
            return None
    
    @staticmethod
    def create(order_data):
        # Add timestamps
        order_data['created_at'] = datetime.utcnow()
        order_data['updated_at'] = datetime.utcnow()
        
        # Generate order number
        order_count = mongo.db.orders.count_documents({})
        order_data['order_number'] = f"ORD-{order_count + 1:06d}"
        
        # Set initial status
        order_data['payment_status'] = 'pending'
        order_data['order_status'] = 'processing'
        
        
        # Calculate order totals
        items = order_data.get('items', [])
        subtotal = sum(item.get('price', 0) * item.get('quantity', 0) for item in items)
        order_data['subtotal'] = subtotal
        
        # Add shipping cost if applicable
        shipping_cost = order_data.get('shipping_cost', 0)
        order_data['total'] = subtotal + shipping_cost
        
        result = mongo.db.orders.insert_one(order_data)
        return str(result.inserted_id), order_data['order_number']
    
    @staticmethod
    def update_status(order_id, status):
        result = mongo.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {
                    "order_status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    @staticmethod
    def update_payment_status(order_id, status):
        result = mongo.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {
                    "payment_status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    @staticmethod
    def add_payment_method(order_id, method_value ):
        result = mongo.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {
                    "payment_type": method_value,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    @staticmethod
    def update_customer_info(order_id, name, phone, address):
        

        result = mongo.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {
                    "name": name,
                    "phone": phone,
                    "address": address
                }
            }
        )
        return result.modified_count > 0