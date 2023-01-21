const express = require("express");
const router = new express.Router();
const UserController = require("../controllers/UserControllers");
const {VerifyAdminAccessToken, VerifyAdminRefreshToken} = require("../middleware/AuthMiddleware")

router.post('/login', UserController.UserLogin);
router.get('/get-clients', VerifyAdminAccessToken, UserController.GetUserClients);
router.get("/get-firms", VerifyAdminAccessToken, UserController.GetFirms);
router.get('/get-products', VerifyAdminAccessToken, UserController.GetProducts);
router.post("/create-order", VerifyAdminAccessToken, UserController.CreateOrder);
router.get("/get-orders", VerifyAdminAccessToken, UserController.GetOrders);
router.get("/get-order/:id",  UserController.GetOrderByID)

module.exports = router;