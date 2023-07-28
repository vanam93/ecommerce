const express= require("express");
const { registerUser, loginUser ,logout, forgotPassword, resetPassword, getUserDetails, changePassword, updateUserProfile, getAllUsers, getSingleUserDetails, updateSingleUserDetails, deleteSingleUser } = require("../controllers/userController");
const { isAuthenticated,authorizedRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated,getUserDetails);
router.route("/password/change").put(isAuthenticated,changePassword);
router.route("/me/update").put(isAuthenticated,updateUserProfile);
router.route("/admin/users").get(isAuthenticated,authorizedRoles("admin"),getAllUsers);
router.route("/admin/user/:id").get(isAuthenticated,authorizedRoles("admin"),getSingleUserDetails).put(isAuthenticated,authorizedRoles("admin"),updateSingleUserDetails).delete(isAuthenticated,authorizedRoles("admin"),deleteSingleUser)

module.exports = router;