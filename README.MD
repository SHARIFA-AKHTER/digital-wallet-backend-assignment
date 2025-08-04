# Digital Wallet API

## 🎯 Project Overview
Design and build a secure, modular, and role-based backend API for a digital wallet system (similar to Bkash or Nagad) using Express.js and Mongoose.

Users can register, manage wallets, and perform core financial operations such as adding money, withdrawing, and sending money.

---

## 🔐 Features & Requirements

- JWT-based authentication with roles: **admin**, **user**, **agent**  
- Secure password hashing with bcrypt  
- Automatic wallet creation at registration with initial balance (e.g., ৳50)  

### Users can:
- Add money (top-up)  
- Withdraw money  
- Send money to other users  
- View transaction history  

### Agents can:
- Add money to any user’s wallet (cash-in)  
- Withdraw money from any user’s wallet (cash-out)  
- View commission history (optional)  

### Admins can USE:
- View all users, agents, wallets, and transactions  
- Block/unblock user wallets  
- Approve/suspend agents  
- Configure system parameters (optional)  

- All transactions are stored and traceable  
- Role-based route protection and authorization middleware  
- Robust validation and error handling  

---

## 🧠 Design & Architecture

- Modular folder structure to separate concerns  
- Role-based access control enforced at API routes  
- Transaction management with atomic balance updates  
- Wallet management integrated with user and agent workflows  
- Proper API response standards with status codes and error messages  

---

## 📁 Project Structure

src/
├── modules/
│ ├── auth/
│ ├── user/
│ ├── wallet/
│ └── transaction/
├── middlewares/
├── config/
├── utils/
├── app.ts


---

## ⚙️ Setup & Installation

1. Clone the repo  
   ```bash
   git clone https://github.com/SHARIFA-AKHTER/digital-wallet-backend-assignment-5.git
   cd digital-wallet-backend-assignment
Install dependencies


npm install
Setup .env file based on .env.example

Start the server


npm run dev
📦 API Endpoints Summary
Authentication
POST /auth/register - Register user/agent

POST /auth/login - Login and receive JWT tokens

Wallet
GET /wallet - View wallet details

POST /wallet/deposit - Add money

POST /wallet/withdraw - Withdraw money

PATCH /wallet/block/:id - Admin blocks/unblocks wallet

Transactions
GET /transactions/me - User/Agent own transactions

GET /transactions - Admin view all transactions

Admin 
GET /admin/users - View all users

PATCH /admin/agents/:id/approve - Approve or suspend agents