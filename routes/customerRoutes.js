import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllCustomers,getCustomerById,createCustomer,
    updateCustomer,deleteCustomer
 } from "../controllers/customerController.js";
import { requireRole } from "../middleware/roleMiddleware.js";
 const router =express.Router();

 router.get("/",protect ,requireRole("admin","manager","sales"),getAllCustomers);
 router.post("/",protect,
    requireRole("admin","manager","sales"),
    createCustomer);
 router.get("/:id",protect,getCustomerById);
 router.put("/:id",protect,updateCustomer);
 router.delete("/:id",protect,requireRole("admin"),deleteCustomer);

 export default router;