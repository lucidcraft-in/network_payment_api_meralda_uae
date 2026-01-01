const axios = require('axios');
const {db} = require('../config/firebase');

/**
 * Process payment through Ngenius API and save to Firestore
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Promise} Returns payment response or error
 */
async function processPayment(req, res) {
  try {
    const apiKey = process.env.NGENIUS_API_KEY;

    const authResponse = await axios.post(
        'https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token',
        null,
        {
          headers: {
            'Content-Type': 'application/vnd.ni-identity.v1+json',
            'Authorization': `Basic ${apiKey}`,
          },
        },
    );

    const accessToken = authResponse.data.access_token;
    if (!accessToken) {
      return res.status(500).json({ error: 'Auth token not received' });
    }

    const paymentResponse = await axios.post(
        'https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/' +
        '04b10197-4923-4697-95fd-4d61d870a66a/payment/card',
        req.body,
        {
          headers: {
            'Content-Type': 'application/vnd.ni-payment.v2+json',
            'Authorization': `Bearer ${accessToken}`,
          },
        },
    );


    // 3. Save to Firebase
    const paymentData = {
      orderRef: paymentResponse.data?.orderRef || null,

      action: req.body?.order?.action,
      amount: req.body?.order?.amount?.value,
      currency: req.body?.order?.amount?.currencyCode,

      cardholderName: req.body?.payment?.cardholderName,

      status: paymentResponse.data?.status || 'CREATED',
      response: paymentResponse.data,

      createdAt: new Date(),
    };


    await db.collection('payments').add(paymentData);


    res.status(201).json({
      message: 'Payment URL generated successfully',
      paymentResponse: paymentResponse.data,

    });
  } catch (err) {
    console.error('Error in processPayment:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data || 'Unknown error',
    });
  }
}

module.exports = { processPayment };
