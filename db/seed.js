require('dotenv').config();
const { faker } = require('@faker-js/faker');
const pool = require('./pool');

const NUM_USERS = 10;
const NUM_PRODUCTS = 30;
const NUM_CART_ITEMS = 15;
const NUM_ORDERS = 5;

async function clearDatabase() {
  console.log('Clearing existing data...');

  await pool.query('DELETE FROM order_items');
  await pool.query('DELETE FROM orders');
  await pool.query('DELETE FROM cart_items');
  await pool.query('DELETE FROM products');
  await pool.query('DELETE FROM users');

  await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
  await pool.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
  await pool.query('ALTER SEQUENCE cart_items_id_seq RESTART WITH 1');
  await pool.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
  await pool.query('ALTER SEQUENCE order_items_id_seq RESTART WITH 1');

  console.log('Database cleared.');
}

async function seedUsers() {
  console.log(`Seeding ${NUM_USERS} users...`);
  const users = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const username = faker.internet.username();
    const email = faker.internet.email();
    const password_hash = faker.string.alphanumeric(60);
    const address = faker.location.streetAddress({ useFullAddress: true });

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, address)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [username, email, password_hash, address]
    );

    users.push(result.rows[0].id);
  }

  console.log(`${NUM_USERS} users created.`);
  return users;
}

async function seedProducts() {
  console.log(`Seeding ${NUM_PRODUCTS} products...`);
  const products = [];

  const categories = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden',
    'Sports', 'Toys', 'Food & Beverages', 'Beauty'
  ];
  
  for (let i = 0; i < NUM_PRODUCTS; i++) {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = faker.commerce.price({ min: 5, max: 999, dec: 2 });
    const stock = faker.number.int({ min: 0, max: 100 });
    const image_url = faker.image.url({ width: 400, height: 400 });
    const category = faker.helpers.arrayElement(categories);

    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, image_url, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, description, price, stock, image_url, category]
    );

    products.push(result.rows[0].id);
  }

  console.log(`${NUM_PRODUCTS} products created.`);
  return products;
}

async function seedCartItems(userIds, productIds) {
  console.log(`Seeding ${NUM_CART_ITEMS} cart items...`);

  const addedItems = new Set();

  for (let i = 0; i < NUM_CART_ITEMS; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    const productId = faker.helpers.arrayElement(productIds);
    const key = `${userId}-${productId}`;

    if (addedItems.has(key)) {
      continue;
    }

    const quantity = faker.number.int({ min: 1, max: 5 });

    try {
      await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [userId, productId, quantity]
      );
      addedItems.add(key);
    } catch (error) {
      if (error.code !== '23505') {
        throw error;
      }
    }
  }

  console.log(`${addedItems.size} cart items created.`);
}

async function seedOrders(userIds, productIds) {
  console.log(`Seeding ${NUM_ORDERS} orders...`);

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  for (let i = 0; i < NUM_ORDERS; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    const status = faker.helpers.arrayElement(statuses);

    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, status, total)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [userId, status, 0]
    );

    const orderId = orderResult.rows[0].id;


    const numItems = faker.number.int({ min: 1, max: 5 });
    let orderTotal = 0;

    for (let j = 0; j < numItems; j++) {
      const productId = faker.helpers.arrayElement(productIds);

      const productResult = await pool.query(
        'SELECT name, price FROM products WHERE id = $1',
        [productId]
      );

      if (productResult.rows.length === 0) continue;

      const product = productResult.rows[0];
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = parseFloat(product.price);
      const subtotal = price * quantity;

      await pool.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, productId, product.name, quantity, price, subtotal]
      );

      orderTotal += subtotal;
    }

    await pool.query(
      'UPDATE orders SET total = $1 WHERE id = $2',
      [orderTotal, orderId]
    );
  }

  console.log(`${NUM_ORDERS} orders created.`);
}

async function seed() {
  try {
    console.log('Starting database seeding...\n');

    await clearDatabase();

    const userIds = await seedUsers();
    const productIds = await seedProducts();
    await seedCartItems(userIds, productIds);
    await seedOrders(userIds, productIds);

    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
