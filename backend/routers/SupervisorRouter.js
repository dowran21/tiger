const express = require("express");
const router = new express.Router()
const SupervisorController = require("../controllers/SupervisorController")
const { VerifyAdminRefreshToken, VerifyIsAdmin, VerifyAdminAccessToken } = require("../middleware/AuthMiddleware");


router.post("/login", SupervisorController.Login)

router.get("/orders",VerifyAdminAccessToken, SupervisorController.GetOrders)

router.post("/update-order/:id", VerifyAdminAccessToken,SupervisorController.UpdateOrder)

router.get("/get-order/:id", VerifyAdminAccessToken, SupervisorController.GetOrderById)

router.get("/get-clients", VerifyAdminAccessToken, SupervisorController.GetClients)

module.exports = router