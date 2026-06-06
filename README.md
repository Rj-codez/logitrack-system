📦 LogiTrack – Package Tracking System


LogiTrack is a lightweight web-based package tracking and logistics management system built using HTML, CSS, and Vanilla JavaScript. It demonstrates core data structure concepts (Queue, Stack) combined with real-world UI workflows for managing packages, tracking updates, and user activity logs.


🚀 Live Demo

https://logitrack-system.vercel.app


📌 Features
🧾 Authentication System
Simple login/logout system (Admin-based demo login)
Session handling using sessionStorage
Route protection for secured pages

📦 Package Management
Add new packages
Search packages by tracking number
Update package status (Pending, In Transit, Delivered)
Delete packages with confirmation modal
View all packages in tabular format

📊 Dashboard Analytics
Total packages count
In Transit count
Delivered count
Pending count
Real-time updates from application state

🧠 Data Structures Used:

Hash Table (JavaScript Object)
Used as the primary data structure for storing and retrieving package records using tracking numbers as unique keys. This enables constant-time lookup, insertion, and deletion operations.

Queue (FIFO) → Package processing flow
Stack (LIFO) → History and activity logs
Centralized AppState for data management

📜 History & Activity Logs
Login / Logout tracking
Package actions history:
Add
Update status
Delete
Recent updates display (latest 5 actions)
Clear activity log feature

🔄 State Persistence
Data stored using localStorage
Session handled via sessionStorage
Automatic state initialization on load


🏗️ Project Structure
LogiTrack/

│

├── index.html

├── 02-dashboard.html

├── 03-add-package.html

├── 04-search-package.html

├── 05-update-status.html

├── 06-all-packages.html

├── 07-history.html

├── 08-delete-packages.html

│

├── assets/

│   ├── css/

│   ├── js/

│   │   ├── app.js

│   │   ├── core/

│   │   ├── ui/

│   │   └── services/

│   └── images/

│

└── README.md


⚙️ Tech Stack
HTML5
CSS3
JavaScript (ES6 Modules)
LocalStorage / SessionStorage
Vercel (Deployment)

🧠 Architecture Overview
AppState → Central data store
services/ → Business logic (CRUD operations)
ui/ → Rendering & DOM updates
core/ → Storage & state initialization
Event-driven design with modular JS

🔐 Demo Login
Username: Admin
Password: 1234

📌 Notes
This is a demo system project for learning purposes.
Focus is on state management, modular architecture, and UI interaction.
No backend server is used; all data is client-side.
📷 Preview


🏁 Status

✔ Stable
✔ Fully functional
✔ Deployed on Vercel
✔ Debugged and optimized

👨‍💻 Author / Group

LogiTrack Project – Developed as a DSA + Frontend integration demo system.
