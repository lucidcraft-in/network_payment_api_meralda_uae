const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const {processPayment} = require('../Controllers/paymentController');

router.post('/process-payment', processPayment);

router.get('/', (req, res) => res.send('Hello from Express on Functions'));

module.exports = router;
