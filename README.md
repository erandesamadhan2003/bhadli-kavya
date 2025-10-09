# Bhadli Kavya

# 🪶 Kavya Backend API

This is the backend for **Bhadli Kavya**, built using **FastAPI** with **MySQL** for data storage.  
It handles user authentication, calendar data, and file uploads.

---

## ⚙️ Project Setup

### 1. Clone the Repository
```bash
git clone <your-repo-link>
cd bhadli-kavya
2. Create and Activate Virtual Environment
bash
Copy code
# Create venv
python -m venv venv

# Activate (Windows PowerShell)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate
3. Install Dependencies
bash
Copy code
pip install fastapi uvicorn mysql-connector-python python-dotenv passlib
🧠 Note:
We use pbkdf2_sha256 hashing from passlib, so bcrypt installation is not required.

🗃️ MySQL Database Setup
1. Create .env File in Root Directory
Create a file named .env (at the same level as the backend folder):

ini
Copy code
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bhadli_kavya
2. Ensure MySQL Server is Running
Start MySQL (e.g., using XAMPP, WAMP, or mysqld).

Verify with:

bash
Copy code
mysql -u root -p
The database and tables will auto-create when the server starts.

🚀 Running the Server
From the project root directory (same level as backend):

bash
Copy code
uvicorn backend.main:app --reload
You should see:

csharp
Copy code
🔍 Loaded DB Config: {'host': 'localhost', 'port': 3306, ...}
✅ Database and tables created successfully
INFO:     Uvicorn running on http://127.0.0.1:8000
🌐 API Endpoints
🏠 Root
GET /
Response:

json
Copy code
{ "message": "Kavya Backend API is running!" }
👤 User Signup
POST /users/signup

Body (JSON):

json
Copy code
{
  "email": "testuser@gmail.com",
  "password": "test123",
  "name": "Test User",
  "uid": "firebase_uid_12345",
  "auth_provider": "email",
  "photoURL": "https://example.com/avatar.png"
}
Response:

json
Copy code
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "testuser@gmail.com",
    "name": "Test User",
    "uid": "firebase_uid_12345",
    "auth_provider": "email",
    "photoURL": "https://example.com/avatar.png"
  },
  "status": "created"
}
🔐 User Login
POST /users/login

Body (JSON):

json
Copy code
{
  "email": "testuser@gmail.com",
  "password": "test123"
}
Response:

json
Copy code
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "testuser@gmail.com",
    "name": "Test User",
    "uid": "firebase_uid_12345",
    "auth_provider": "email",
    "photoURL": "https://example.com/avatar.png"
  }
}
🧰 Developer Notes
✅ Auto Database Initialization
When the app starts, it automatically:

Connects to MySQL using .env credentials.

Creates the database bhadli_kavya (if it doesn’t exist).

Creates required tables:

users

calendar

🧠 Password Hashing
Passwords are securely hashed using PBKDF2 (SHA-256) from passlib.

Verification is handled using:

python
Copy code
pbkdf2_sha256.verify(plain_password, hashed_password)
📦 Folder Structure
pgsql
Copy code
bhadli-kavya/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routers/
│   │   ├── users.py
│   │   ├── upload.py
│   │   └── calendar.py
│   └── __init__.py
│
├── .env
└── README.md
🧪 Testing with Postman
Run the backend:

bash
Copy code
uvicorn backend.main:app --reload
Open Postman and send requests to:

POST http://127.0.0.1:8000/users/signup

POST http://127.0.0.1:8000/users/login

GET http://127.0.0.1:8000/

Verify data in MySQL:

bash
Copy code
mysql -u root -p
use bhadli_kavya;
select * from users;