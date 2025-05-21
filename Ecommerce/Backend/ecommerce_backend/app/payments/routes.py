import requests
from flask import Blueprint, request, jsonify
from app.orders.models import Order  # Adjust import as per your project structure
from app import mongo

payments_bp = Blueprint('payments', __name__)

# Your 2Checkout credentials
TCO_MERCHANT_CODE = 'your_merchant_code'
TCO_PRIVATE_KEY = 'your_private_key'

@payments_bp.route('/', methods=['POST'])
def process_payment():
    data = request.get_json()
    order_id = data.get('order_id')
    token = data.get('token')
    amount = data.get('amount')

    if not order_id or not token or not amount:
        return jsonify({"error": "Missing required payment information"}), 400

    # Fetch order from DB
    order = Order.get_by_id(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    # Prepare 2Checkout payment payload
    payment_payload = {
        "merchantOrderId": order_id,
        "token": token,
        "currency": "USD",  # Adjust currency if needed
        "total": amount
    }

    # 2Checkout API endpoint
    tco_url = "https://api.2checkout.com/rest/6.0/payments"

    try:
        response = requests.post(
            tco_url,
            json=payment_payload,
            auth=(TCO_MERCHANT_CODE, TCO_PRIVATE_KEY)
        )
        response_data = response.json()

        if response.status_code == 201:
            # Payment successful
            Order.update_payment_status(order_id, 'paid')
            return jsonify({
                "message": "Payment processed successfully",
                "payment_info": response_data
            })
        else:
            # Payment failed - update status to pending or failed as per your logic
            Order.update_payment_status(order_id, 'pending')
            error_message = response_data.get('error_message', 'Payment failed')
            return jsonify({"error": error_message}), 400

    except Exception as e:
        # On exception, mark payment as pending for manual review
        Order.update_payment_status(order_id, 'pending')
        return jsonify({"error": f"Payment processing error: {str(e)}"}), 500
