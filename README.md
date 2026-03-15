# 🏷️ AuctionSpace --- Multi‑Vendor Auction Marketplace

AuctionSpace is a **full‑stack MERN application** that simulates a
real-world **multi‑vendor auction platform** where users can participate
in auctions, vendors can list products, and administrators can manage
the ecosystem.

The platform implements a **complete marketplace workflow**, including
auction listing, competitive bidding, commission-based revenue
generation, payment proof verification, and administrative moderation.

It is built with **production-ready backend architecture**, **role-based
authorization**, **automation through cron jobs**, and **email
communication using NodeMailer**.

------------------------------------------------------------------------

# 🚀 Project Overview

AuctionSpace enables three main types of users:

1.  **Bidders**
2.  **Auctioneers (Vendors)**
3.  **Super Admin**

Each role has clearly defined permissions controlled through
**authentication and authorization middleware**.

The system demonstrates practical concepts used in **real-world
marketplace platforms**, such as:

-   Vendor commission models
-   Payment verification systems
-   Auction lifecycle management
-   Role-based access control
-   Automated email notifications

------------------------------------------------------------------------

# 🧰 Tech Stack

## Frontend

-   React.js
-   Redux Toolkit
-   Tailwind CSS
-   Axios

## Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose

## Authentication & Security

-   JWT Authentication
-   Cloudinary Image Storage
-   Role-based Authorization Middleware
-   Custom Error Handling Middleware
-   Async Controller Handlers

## Automation & Communication

-   NodeMailer for sending transactional emails
-   Node Cron for scheduled jobs and reminders

## Deployment

-   **Vercel** -- https://auctionspace.vercel.app/
-   **Render** -- https://auction-room-backend.onrender.com/api/v1/auctionItem/auctionitems

------------------------------------------------------------------------

# 🏗️ Architecture Design

AuctionSpace follows a **modular full‑stack architecture**.

Frontend communicates with backend through **REST APIs**, while backend
handles:

-   Authentication
-   Business logic
-   Auction lifecycle
-   Commission management
-   Data storage

MongoDB stores application data including:

-   Users
-   Auctions
-   Bids
-   Commission payments

------------------------------------------------------------------------

# 👤 User Roles

## 🧑 Bidder

Bidders are users who participate in auctions and compete to win items.

### Features

-   Register and login securely
-   Browse all active auctions
-   Place bids on auction items
-   View bidding leaderboard
-   Track their bidding position
-   Receive email notifications

### Leaderboard System

Each auction displays a **dynamic leaderboard** where bidders can see:

-   Current highest bidder
-   Bid ranking
-   Competition status

This creates a **transparent and competitive auction environment**.

------------------------------------------------------------------------

## 🏪 Auctioneer (Vendor)

Auctioneers are vendors who list items for auction.

They manage their listings through a **dedicated dashboard**.

### Features

-   Create auction listings
-   Upload item details and images
-   Track bids placed on their items
-   View winning bids
-   Upload commission payment proof
-   Monitor unpaid commissions

------------------------------------------------------------------------

# 💰 Commission System

AuctionSpace implements a **platform revenue model**.

After an auction ends:

Auctioneer must pay **8% commission** of the winning bid amount.

Example:

Winning Bid = \₹1000\
Platform Commission (8%) = \₹80

### Commission Workflow

1.  Auction completes
2.  Winning amount is recorded
3.  Auctioneer pays commission externally
4.  Auctioneer uploads payment proof
5.  Super Admin verifies proof
6.  Status updated

⚠️ **Restriction:**

Auctioneers **cannot create new auctions** until all pending commission
payments are verified.

This ensures **platform integrity and revenue protection**.

------------------------------------------------------------------------

# 🛠️ Super Admin

The Super Admin manages the entire platform.

### Responsibilities

-   Manage all users
-   Delete users
-   Remove auction listings
-   Review commission payment proofs
-   Approve or reject commission submissions
-   Monitor platform activity

This ensures the platform remains **secure, fair, and well‑regulated**.

------------------------------------------------------------------------

# ⚙️ Backend Engineering Practices

The backend follows **production-level architecture patterns**.

## Authentication Middleware

JWT-based authentication protects private routes.

Ensures only authenticated users can access restricted endpoints.

------------------------------------------------------------------------

## Role Authorization Middleware

Role-based permissions enforce system rules.

Example:

-   Only Auctioneers can create auctions
-   Only Bidders can place bids
-   Only Super Admin can approve commission payments

------------------------------------------------------------------------

## Global Error Handling

A centralized custom error handler ensures:

-   Consistent API responses
-   Clean debugging
-   Safer production deployment

------------------------------------------------------------------------

## Async Controller Handling

Async wrapper prevents:

-   Unhandled promise rejections
-   Server crashes

Improves **backend reliability and maintainability**.

------------------------------------------------------------------------

# ⏰ Automation System

AuctionSpace uses **Node Cron** to automate tasks such as:

-   Auction reminders
-   Deadline notifications
-   Payment reminders for auctioneers

Automation improves **user engagement and platform efficiency**.

------------------------------------------------------------------------

# 📱 Responsive Design

The platform is **fully responsive** and optimized for:

-   Desktop
-   Tablet
-   Mobile devices

This allows bidders to **participate in auctions from anywhere**.

------------------------------------------------------------------------

# 📂 Project Structure

AuctionSpace │ ├── frontend │ ├── components │ ├── pages │ ├── redux │
├── services │ └── utils │ ├── backend │ ├── controllers │ ├── models │
├── routes │ ├── middleware │ │ ├── authentication │ │ ├──
roleAuthorization │ │ └── errorHandler │ ├── utils │ └── cron │ └──
README.md

------------------------------------------------------------------------

# 🧪 Local Development Setup

## Clone Repository

git clone https://github.com/sakettt07/Auction_Room-FullStack

cd frontend
npm install

Create a `.env` file:

VITE_API_BASE_URL= Add your render deployment URL
------------------------------------------------------------------------

## Backend Setup

cd backend
npm install

Create a `.env` file:

PORT=4000

MONGO_URI="add yours"

FRONTEND_URL= "vercel hosted url"

// cloudinary setup
CLOUDINARY_CLOUD_NAME="Cloudinary dashboard"
CLOUDINARY_API_SECRET="Cloudinary dashboard"
CLOUDINARY_API_KEY= "Cloudinary dashboard"


JWT_SECRET= "Add random text"
JWT_EXPIRES_IN= any days (3d)
JWT_COOKIE_EXPIRE= number


// all the mail service secrets
SMTP_SERVICE=gmail

SMTP_MAIL=Add Yours
SMTP_PASSWORD=Add Yours
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465


Run backend:

npm run dev

------------------------------------------------------------------------

## Frontend Setup

cd frontend

npm install

npm run dev

------------------------------------------------------------------------

# 📈 Key Highlights

• Full MERN Stack implementation\
• Multi‑vendor marketplace architecture\
• Role‑based authorization system\
• Commission revenue model implementation\
• Email automation using NodeMailer\
• Cron-based scheduled tasks\
• Secure REST API structure\
• Responsive UI design\
• Production-ready backend structure

------------------------------------------------------------------------

# 🚀 Future Improvements

Potential enhancements:

-   Real-time bidding using WebSockets
-   Integrated payment gateway
-   Live auction timers
-   Escrow-based transaction system
-   Advanced analytics dashboard
-   AI-based price prediction

------------------------------------------------------------------------

# 👨‍💻 Author

Saket Gupta

Full Stack Developer focused on building scalable web platforms and
marketplace systems.

------------------------------------------------------------------------

⭐ If you found this project interesting, consider giving it a **star on
GitHub**.
