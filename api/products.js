import express from "express";
const router = express.Router();
import { getProducts, getProductById } from "#db/queries/products";

import { getOrdersByUserIdThatContainsProductId } from "#db/queries/orders";
import requireUser from "#middleware/requireUser";
export default router;

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

router.param("id", async (req, res, next, id) => {
  const product = await getProductById(id);
  if (!product) return res.status(404).send("Product not found.");
  req.product = product;
  next();
});

router.get("/:id", (req, res) => res.send(req.product));

router.use(requireUser);

router.get("/:id/orders", async (req, res) => {
  const orders = await getOrdersByUserIdThatContainsProductId(
    req.user.id,
    req.product.id
  );
  res.send(orders);
});
