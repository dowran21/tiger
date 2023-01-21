const express = require("express");
const router = new express.Router()
const AdminController = require("../controllers/AdminControllers");
const { VerifyAdminRefreshToken, VerifyIsAdmin, VerifyAdminAccessToken } = require("../middleware/AuthMiddleware");

router.post('/login', AdminController.Login);
router.get('/load-admin', VerifyAdminRefreshToken, AdminController.LoadAdmin);
router.get('/get-clients', VerifyAdminAccessToken, VerifyIsAdmin, AdminController.GetClients);
router.get('/get-client-info/:id', VerifyAdminAccessToken, VerifyIsAdmin, AdminController.GetClientInfo);
router.post("/update-location/:id", VerifyAdminAccessToken, AdminController.UpdateLocation);
router.post('/add-operator', VerifyAdminAccessToken, VerifyIsAdmin, AdminController.AddOperator)
router.get("/get-users", VerifyAdminAccessToken, VerifyIsAdmin, AdminController.GetUsers)
router.get('/get-whs', VerifyAdminAccessToken, VerifyIsAdmin, AdminController.GetWhs)
router.post("/change-sls-wh/:id", VerifyAdminAccessToken, VerifyIsAdmin, AdminController.ChangeSlsManWh)

router.get("/get-sales-mans/:id", VerifyAdminAccessToken, VerifyIsAdmin, AdminController.GetSalesMans)
router.post("/add-sls-mans/:id", VerifyAdminAccessToken, VerifyIsAdmin, AdminController.AddSalesMans);
router.post("/delete-sls-man/:id", VerifyAdminAccessToken, VerifyIsAdmin, AdminController.DeleteUSM)
router.get("/get-sls-mans-for-mod", VerifyAdminAccessToken, VerifyIsAdmin, AdminController.GetSalesManagerForMod)
router.get('/get-clients-for-sls/:id', VerifyAdminAccessToken, VerifyIsAdmin, AdminController.GetSlsManClients)
router.post("/add-clietns-to-sls/:id", VerifyAdminAccessToken, VerifyIsAdmin, AdminController.AddClientsToSlsMan)

router.post('/delete-client-from-sls-man/:id', VerifyAdminAccessToken, VerifyIsAdmin, AdminController.DeleteClientFromSls)
router.post('/change-sls-firm/:id', VerifyAdminAccessToken, VerifyIsAdmin, AdminController.ChangeSlsManFirm)

module.exports = router