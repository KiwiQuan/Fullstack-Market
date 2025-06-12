import express from "express";
const app = express();
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#api/users";
import productsRouter from "#api/products";
import ordersRouter from "#api/orders";
export default app;

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use((err, req, res, next) => {
  if (err.code === "23505") {
    return res.status(400).send(err.detail);
  } else if (err.code === "23503") {
    return res.status(400).send(err.detail);
  } else if (err.code === "22P02") {
    return res.status(400).send(err.mesage);
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong :(");
});
