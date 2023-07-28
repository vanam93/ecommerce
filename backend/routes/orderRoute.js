const express= require("express");
const { newOrder, getSingleOrder, getmyOrder, getmyOrders, getAllOrders, deleteOrder , updateOrder } = require("../controllers/orderController");
const { isAuthenticated,authorizedRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/order/new").post(isAuthenticated,newOrder);
router.route("/order/:id").get(isAuthenticated,getSingleOrder);
router.route("/orders/me").get(isAuthenticated,getmyOrders);
router.route("/admin/orders/all").get(isAuthenticated,authorizedRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticated,authorizedRoles("admin"),updateOrder).delete(isAuthenticated,authorizedRoles("admin"),deleteOrder)

module.exports=router;