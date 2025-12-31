const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/paymentController");


router.post("/process-payment", paymentController.processPayment);

router.get("/", (req, res) => res.send("Hello from Express on Functions"));

module.exports = router;
