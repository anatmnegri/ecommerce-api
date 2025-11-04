import { Router } from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
} from "../controllers/customer.controller.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomerId,
} from "../controllers/order.controller.js";

const router = Router();

router.get("/health", (_, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

router.post("/customer", createCustomer);
router.get("/customers", getAllCustomers);
router.get("/customer/:id", getCustomerById);

router.post("/product", createProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", getProductById);

router.post("/order", createOrder);
router.get("/orders", getAllOrders);
router.get("/order/:id", getOrderById);
router.get("/orders/customer/:customerId", getOrdersByCustomerId);

export default router;
