import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createProduct } from "#db/queries/products";
import { createOrderProduct } from "#db/queries/orders_products";
import { createOrder } from "#db/queries/orders";
import { createUser } from "#db/queries/users";
await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
  const user1 = await createUser("Mark", "password");
  await createUser("John", "password");
  await createUser("Jane", "password");
  for (let i = 0; i < 3; i++) {
    const order = await createOrder(
      faker.date.past().toISOString().split("T")[0],
      user1.id
    );
    for (let j = 0; j < 5; j++) {
      const product = await createProduct(
        faker.commerce.productName(),
        faker.commerce.productDescription(),
        faker.commerce.price()
      );
      await createOrderProduct(
        order.id,
        product.id,
        faker.number.int({ min: 1, max: 10 })
      );
    }
  }
}
