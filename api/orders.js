import express from "express";
const router = express.Router();
import {
  createOrder,
  getOrdersByUserId,
  getOrderByUserId,
  increaseOrderProductQuantity,
  getProductsByOrderId,
} from "#db/queries/orders";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
export default router;

router.use(requireUser);

router
  .route("/")
  .post(requireBody(["date"]), async (req, res) => {
    const { date } = req.body;
    const order = await createOrder(date, req.user.id);
    res.status(201).send(order);
  })
  .get(async (req, res) => {
    const orders = await getOrdersByUserId(req.user.id);
    res.send(orders);
  });

router.route("/:id").get(async (req, res) => {
  if (Number.isNaN(Number(req.params.id)))
    return res.status(400).send("Order id required.");
  const order = await getOrderByUserId(req.user.id, Number(req.params.id));
  if (!order) return res.status(404).send("Order not found.");

  if (req.user.id !== order.user_id)
    return res.status(403).send("You are not authorized to view this order.");
  res.send(order);
});

router
  .route("/:id/products")
  .post(requireBody(["productId", "quantity"]), async (req, res) => {
    if (Number.isNaN(Number(req.params.id)))
      return res.status(400).send("Order id required.");
    const order = await getOrderByUserId(req.user.id, Number(req.params.id));
    if (!order) return res.status(404).send("Order not found.");

    if (req.user.id !== order.user_id)
      return res
        .status(403)
        .send("You are not authorized to update this order.");
    const { productId, quantity } = req.body;
    const updatedOrder = await increaseOrderProductQuantity(
      order.id,
      productId,
      quantity
    );
    res.send(updatedOrder);
  })
  .get(async (req, res) => {
    if (Number.isNaN(Number(req.params.id)))
      return res.status(400).send("Order id required.");
    const order = await getOrderByUserId(req.user.id, Number(req.params.id));
    if (!order) return res.status(404).send("Order not found.");

    if (req.user.id !== order.user_id)
      return res
        .status(403)
        .send("You are not authorized to update this order.");
    const products = await getProductsByOrderId(order.id);
    res.send(products);
  });
