const express = require("express")
const router = express.Router();
const {isAuthenticated} = require("../middleware/authMiddleware.js");
const { processPayment,sendStripeApiKey } = require("../controllers/paymentController.js");

router.route("/process/payment").post(isAuthenticated,processPayment)
router.route("/stripeapikey").get(sendStripeApiKey)

module.exports = router



