const express= require("express");
const { getAllProducts, createNewProduct, getAllProductsAdmin, updateProduct, deleteProduct, getProductDetails, productReview, getAllReviews, deleteReview } = require("../controllers/productController");
const { isAuthenticated,authorizedRoles } = require("../middleware/authMiddleware");

const router=express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticated,authorizedRoles("admin"),getAllProductsAdmin);
router.route("/admin/product/new").post(isAuthenticated,authorizedRoles("admin"),createNewProduct);
router.route("/admin/product/:id").put(isAuthenticated,authorizedRoles("admin"),updateProduct).delete(isAuthenticated,authorizedRoles("admin"),deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticated,productReview);
router.route("/reviews").get(getAllReviews).delete(deleteReview)

module.exports = router;