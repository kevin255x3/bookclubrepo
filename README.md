Hey, I wanted to share my book collection application that brings together my love of reading with an introspective digital experience.

This project marks my first time connecting a React frontend with an Express backend, creating a full-stack environment that feels both personal and functional. The design draws inspiration from thoughtful editorial layouts and album artwork, letting each book exist as both information and memory.

**About**
This application allows you to:

Browse a personal library of books
Filter by categories
View detailed information about each book
Add new books with cover images
Edit and remove entries

The intentional negative space and minimal typography create room for contemplation - much like the experience of browsing a physical bookshelf.

**⚠️ IMPORTANT SETUP NOTE ⚠️**

Before beginning, you'll need to set up the MySQL database:

Ensure MySQL is installed and running
Connect to MySQL as an administrator: mysql -u root -p
In the MySQL prompt, create the database and user: CREATE DATABASE book_collection; CREATE USER 'bookclub_user'@'localhost' IDENTIFIED BY 'Bookclub444!'; GRANT ALL PRIVILEGES ON book_collection.* TO 'bookclub_user'@'localhost'; FLUSH PRIVILEGES; EXIT;

After creating the database and user, initialize the tables by importing the SQL files:

cd assignment-2/api
mysql -u bookclub_user -p book_collection < auth-db-update.sql
mysql -u bookclub_user -p book_collection < custom-books.sql

**Default Login**
After setup, you can log in with:
Email: default@example.com
Password: password123

**Note for Windows Users:** 
The database connection in this project uses a Unix socket path (/tmp/mysql.sock) which works on Mac/Linux. If you're using Windows, you may need to modify the db.js file by commenting out this line:


// In api/config/db.js, comment out this line if using Windows:
// socketPath: '/tmp/mysql.sock', 


**RUNNING THE PROJECT**

Backend Setup
cd assignment-2/api
npm install
npm run dev

Frontend Setup
cd assignment-2/web
npm install
npm start

The application connects to a MySQL database that stores both the book information and relationships between books and categories.

**What I Learned**
Building this project taught me how to bridge the gap between client and server. The challenges of file uploads, database relationships, and state management pushed me to understand how data flows through a complete application.

I discovered that backend development isn't just about functionality - it's about creating thoughtful structures that support the frontend experience. Each database query and API endpoint became part of a larger conversation between user and interface.

**Moving Forward**

I plan to expand this project with

User authentication to create personal reading lists
Reading progress tracking
Connection to external book APIs
Recommendations based on reading patterns

There's something intimate about cataloging the books that shape us. This project is just the beginning of bringing that relationship into digital space.

**Login Implementation**

I've added authentication to create a more personal connection with the collection. The boundary between public and private mirrors how we share parts of our reading lives with others.

The login system uses JWT tokens to maintain session state - invisible threads connecting user to memory. Each book now belongs to someone, creating islands of literary identity within the database.

Building this reminded me how authentication isn't just about security - it's about creating a space that remembers you. The technical challenge of password hashing and token validation became a meditation on digital presence and the persistence of memory.

The login screens are intentionally minimal, creating a threshold space between anonymity and recognition. I wanted that moment of identification to feel like opening a familiar book to a dog-eared page.

Updated Instructions, my apologies.
