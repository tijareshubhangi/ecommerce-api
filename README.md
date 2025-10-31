## Advanced E-Commerce API (Node.js + MongoDB)
Project Overview
This is a complete backend API for an E-Commerce web application, built using Node.js, Express, and MongoDB.
It includes user authentication, admin control, cart management, product handling, and order-payment workflow.
The project focuses on writing clean APIs, handling transactions properly, and managing stock and orders in real time.

## Tech Stack Used
Node.js with Express.js for backend server
MongoDB and Mongoose for database and schema design
JWT for authentication and authorization
Bcrypt.js for password encryption
Joi for input validation
A simple async email mock system for payment confirmation
Role-based access (Admin & User)

## Installation & Setup
Follow the steps below to run the project locally:
Clone the repository
git clone https://github.com/tijareshubhangi/ecommerce-api.git
cd ecommerce-api

## Install all dependencies
npm install
Create a .env file in the root folder and add:
PORT=5000
MONGO_URI=mongodb+srv://shubhangi_user:N86fw7jO8b7SGY8h@ecommers.l3k7gwz.mongodb.net/?appName=ecommers
JWT_SECRET=nodejs_task

## Start the server
npm start

## API Testing Results (Postman)
Below are the tested API endpoints with example requests and responses.
All APIs were successfully verified using Postman on local server (port 5000).

1. Register User
POST → http://localhost:5000/api/auth/register
Body (raw → JSON):
{
  "name": "Shubhangi",
  "email": "shubhangi@example.com",
  "password": "123456"
}
Response:
{
  "user": {
    "id": "6903a79fd11948d12c122a00",
    "name": "Shubhangi",
    "email": "shubhangi@example.com",
    "role": "USER"
  },
  "token": "<USER_TOKEN>"
}

Admin Registration:
{
  "name": "Admin User",
  "email": "newadmin@example.com",
  "password": "admin12345",
  "role": "ADMIN"
}
Response:
{
  "user": {
    "id": "6904363745946d426cac4cf7",
    "name": "Admin User",
    "email": "newadmin@example.com",
    "role": "ADMIN"
  },
  "token": "<ADMIN_TOKEN>"
}

2. Login User
POST → http://localhost:5000/api/auth/login
Body:
{
  "email": "shubhangi@example.com",
  "password": "123456"
}
Response:
{
  "token": "<USER_TOKEN>",
  "user": {
    "id": "69042f1145946d426cac4ce0",
    "name": "Shubhangi",
    "email": "shubhangi@example.com",
    "role": "USER"
  }
}

Admin Login:
{
  "email": "newadmin@example.com",
  "password": "admin12345"
}
Response:
{
  "token": "<ADMIN_TOKEN>",
  "user": {
    "id": "6904363745946d426cac4cf7",
    "name": "Admin User",
    "email": "newadmin@example.com",
    "role": "ADMIN"
  }
}

3. Get All Products
GET → http://localhost:5000/api/products
Response (Before adding products):
{
  "total": 0,
  "page": 1,
  "limit": 10,
  "products": []
}
Response (After adding product as Admin):
{
  "total": 1,
  "page": 1,
  "limit": 10,
  "products": [
    {
      "_id": "690437ac45946d426cac4d00",
      "name": "Wooden Chair",
      "price": 2000,
      "description": "Strong and stylish wooden chair",
      "availableStock": 10,
      "reservedStock": 0,
      "__v": 0
    }
  ]
}

4. Add Product (Admin only)
POST → http://localhost:5000/api/products
Header: Authorization: Bearer <ADMIN_TOKEN>
Body:
{
  "name": "Study Table",
  "price": 3500,
  "description": "Wooden study table with storage",
  "availableStock": 5
}
Response:
{
  "name": "Study Table",
  "price": 3500,
  "description": "Wooden study table with storage",
  "availableStock": 5,
  "reservedStock": 0,
  "_id": "6904383b45946d426cac4d05",
  "__v": 0
}

5. Add Item to Cart
POST → http://localhost:5000/api/cart/items
Header: Authorization: Bearer <USER_TOKEN>
Body:
{
  "productId": "6904383b45946d426cac4d05",
  "quantity": 2
}
Response:

{
  "userId": "69042f1145946d426cac4ce0",
  "items": [
    {
      "productId": "6904383b45946d426cac4d05",
      "quantity": 2,
      "_id": "6904391145946d426cac4d0f"
    }
  ],
  "_id": "6904391145946d426cac4d0e",
  "__v": 0
}

6. Get Cart
GET → http://localhost:5000/api/cart
Access: User
Header: Authorization: Bearer <USER_TOKEN>
Response:
{
  "_id": "6904391145946d426cac4d0e",
  "userId": "69042f1145946d426cac4ce0",
  "items": [
    {
      "productId": {
        "_id": "6904383b45946d426cac4d05",
        "name": "Study Table",
        "price": 3500,
        "description": "Wooden study table with storage",
        "availableStock": 5,
        "reservedStock": 0,
        "__v": 0
      },
      "quantity": 2,
      "_id": "6904391145946d426cac4d0f"
    }
  ],
  "__v": 0
}

7. Checkout Order
POST → http://localhost:5000/api/orders/checkout
Header: Authorization: Bearer <USER_TOKEN>
Body: {}
Response:
{
  "_id": "690447e03b58f78cdadb8aa2",
  "userId": "690446763b58f78cdadb8a93",
  "status": "PENDING_PAYMENT",
  "totalAmount": 5000
}

8. Pay for Order
POST → http://localhost:5000/api/orders/:id/pay
Example: http://localhost:5000/api/orders/690447e03b58f78cdadb8aa2/pay
Header: Authorization: Bearer <USER_TOKEN>
Body: {}
Response:
{
  "message": "Payment successful, order PAID",
  "payment": {
    "orderId": "690447e03b58f78cdadb8aa2",
    "transactionId": "txn_1761888483339",
    "amount": 5000,
    "status": "SUCCESS",
    "_id": "690448e33b58f78cdadb8aa9",
    "createdAt": "2025-10-31T05:28:03.341Z",
    "updatedAt": "2025-10-31T05:28:03.341Z",
    "__v": 0
  }
}
