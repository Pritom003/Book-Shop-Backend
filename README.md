# 📚 Book Shop

This project is a **Book Store API** built with **Express** and **TypeScript**, using **MongoDB** as the database and **Mongoose** for schema validation and data operations. The API allows you to manage a book store by performing CRUD operations on books, place orders, and calculate total revenue from sales.

---

## ✨ **Features**

### **Books Management**

- Add a new book to the store. **Endpoint: /api/products**
- Retrieve all books **Endpoint: /api/products**
- Retrieve a specific book by its ID. **Endpoint: /api/products/:productId**
- Update book details such as price, quantity, etc. **Endpoint: /api/products/:productId**
- Delete a book from the store. **Endpoint: /api/products/:productId**

### **Orders Management**

- Place an order for books.**Endpoint: /api/orders**
- Automatically manage inventory by updating stock and availability.
- Handle cases for insufficient stock.

### **Revenue Management**

- Calculate total revenue from all orders using MongoDB's aggregation pipeline.**Endpoint: /api/orders//revenue**

---

## 🚀 **Tech Stack**

- **Node.js** with **Express**: Backend framework.
- **TypeScript**: Ensures type safety and robust development.
- **MongoDB** with **Mongoose**: Database and object modeling.
- **Postman**: API testing.
- **Docker** _(optional)_: For containerized deployment.
- **Vercel**: Deployment.

---

## 🔧 **Setup Instructions**

### Prerequisites

- **Node.js** (>=16.x)
- **MongoDB** (Local or MongoDB Atlas account)

### Steps to Set Up Locally

1. git clone https://github.com/Pritom003/Book-Shop-Backend.git

2. cd Book-Shop-Backend

### Install dependencies:

3.  npm install

#### 4. Create a .env file in the root directory and configure the following variables:

```

PORT=5000
MONGO_URI=mongodb+srv://user-v3:wrwQprhEVqQyK0MQ@cluster0.ucoarqa.mongodb.net/Book-Shop?retryWrites=true&w=majority&appName=Cluster0
```

# Start the development server:

npm run dev

<<<<<<< HEAD
The server will run at http://localhost:5000.

### Live Link - https://book-shop-backend-navy.vercel.app/api/products

=======
The server will run at http://localhost:5000.

### Live Link - https://book-shop-backend-navy.vercel.app

> > > > > > > 2dfb8287a9914697587aaf0e2781e8734f167d55
