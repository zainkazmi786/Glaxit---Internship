const express = require('express');
const router = express.Router();
const orderController = require('./orderControllers');

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateStatus);
router.put('/:id/method', orderController.updatePaymentMethod);
router.put('/:id/customer-info', orderController.updateCustomerInfo);
router.put('/:id/payment-status', orderController.updatePaymentStatus); // New route

module.exports = router;
