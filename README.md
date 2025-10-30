# 🛒 Advanced E-Commerce API (Node.js + MongoDB)

## Project Overview
This is a complete backend API for an **E-Commerce web application**, built using Node.js, Express, and MongoDB.  
It includes user authentication, admin control, cart management, product handling, and order-payment workflow.  
The project focuses on writing clean APIs, handling transactions properly, and managing stock and orders in real time.

---

## Tech Stack Used
- Node.js with Express.js for backend server
- MongoDB and Mongoose for database and schema design
- JWT for authentication and authorization
- Bcrypt.js for password encryption
- Joi for input validation
- A simple async email mock system for payment confirmation
- Role based access (Admin & User)

---

## Installation & Setup
Follow the steps below to run the project locally:

1. Clone the repository  
   ```bash
   git clone https://github.com/tijareshubhangi/ecommerce-api.git
   cd ecommerce-api

2. Install all dependencies   
    npm install

3. Create a .env file in the root folder and add:
       PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerceDB
JWT_SECRET=nodejs_task

4. Start the server
   npm start     
 
     