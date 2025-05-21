from flask import Blueprint, request, jsonify
from bson import json_util
import json
from app.orders.models import Order
from app.products.models import Product  

orders_bp = Blueprint('orders', __name__)

# Helper function to convert ObjectId to string
def parse_json(data):
    return json.loads(json_util.dumps(data))

@orders_bp.route('/', methods=['GET'])
def get_orders():
    limit = int(request.args.get('limit', 20))
    skip = int(request.args.get('skip', 0))
    orders = Order.get_all(limit, skip)
    return jsonify(parse_json(orders))

@orders_bp.route('/<order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.get_by_id(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    return jsonify(parse_json(order))

@orders_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json()

    if not data.get('customer_email') or not data.get('items'):
        return jsonify({"error": "Missing customer_email or items"}), 400

    final_items = []
    for item in data['items']:
        product_id = item.get('product_id')
        quantity = item.get('quantity', 1)

        if not product_id:
            return jsonify({"error": "Missing product_id in one of the items"}), 400

        product = Product.get_by_id(product_id)
        if not product:
            return jsonify({"error": f"Product with ID {product_id} not found"}), 404

        # Snapshot the product data into order
        final_items.append({
            "product_id": str(product["_id"]),
            "name": product["title"],
            "price": product["price"],
            "quantity": quantity,
            "image": product.get("image", "")
        })

    # Replace items with enriched ones
    data['items'] = final_items

    # Proceed to create order
    order_id, order_number = Order.create(data)

    return jsonify({
        "id": order_id,
        "order_number": order_number,
        "message": "Order placed successfully"
    }), 201

@orders_bp.route('/<order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.get_json()
    
    if not data.get('status'):
        return jsonify({"error": "Status is required"}), 400
    
    status = data.get('status')
    allowed_statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if status not in allowed_statuses:
        return jsonify({"error": f"Status must be one of: {', '.join(allowed_statuses)}"}), 400
    
    success = Order.update_status(order_id, status)
    if not success:
        return jsonify({"error": "Order not found or could not be updated"}), 404
    
    return jsonify({"message": "Order status updated successfully"})


@orders_bp.route('/<order_id>/method', methods=['PUT'])
def update_order_payment_method(order_id):
    """
    API endpoint to update the payment_method for a specific order using the Order model's static method.
    Expected request body: {"payment_method": "cod" or "online"}
    URL: /api/orders/<order_id>/method (e.g., http://localhost:5000/api/orders/60d5ec49f8b4a2d3e4f5a6b7/method)
    Method: PUT
    """
    data = request.get_json()
    payment_method = data.get('payment_method')

    if not payment_method:
        return jsonify({"error": "Missing 'payment_method' in request body"}), 400

    if payment_method not in ['cod', 'online']:
        return jsonify({"error": "Invalid 'payment_method'. Must be 'cod' or 'online'."}), 400

    # Call the static method from your Order model
    # Note: Your static method updates 'payment_status', not 'payment_method' field based on your provided code.
    # If you intend to set 'payment_method', please adjust your static method's logic.
    # For now, I'm using 'payment_status' as per your static method's code.
    updated = Order.add_payment_method(order_id, payment_method)

    if updated:
        return jsonify({"message": f"Payment method (status) for order {order_id} updated successfully to '{payment_method}'"}), 200
    else:
        # This could mean order not found or method was already the same
        # You might want more granular error handling in your static method
        return jsonify({"error": "Failed to update payment method (order not found or no change needed)"}), 404

@orders_bp.route('/<order_id>/customer-info', methods=['PUT'])
def update_customer_info(order_id):
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')

    if not name or not phone or not address:
        return jsonify({"error": "Name, phone, and address are required"}), 400



    # Update the order document with new customer info
    result = Order.update_customer_info(order_id, name, phone, address)
    if not result:
        return jsonify({"error": "Order not found or could not be updated"}), 404

    return jsonify({"message": "Customer information updated successfully"})