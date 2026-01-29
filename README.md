# 🎯 Bhadli Kavya - Poetry & Calendar Application

A full-stack application with React Native (Expo Web) frontend and FastAPI backend, using Aiven Cloud MySQL database.

---

## 🚀 Quick Start for Developers

### Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed ([Get Docker Compose](https://docs.docker.com/compose/install/))
- Git installed

---

## 📥 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/erandesamadhan2003/bhadli-kavya.git
cd bhadli-kavya
```

### 2️⃣ Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

**Important:** Edit the `.env` file and update these values with your own credentials:

```bash
# Open .env in your editor
nano .env   # or use: vim .env, code .env, etc.

# Update these values:
DB_HOST=your-database-host
DB_PORT=your-database-port
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

> **Note:** You need your own Aiven MySQL database or use a local MySQL database. Update the connection details accordingly.

### 3️⃣ Start the Application

Simply run:

```bash
./start-docker.sh
```

This script will:

- ✅ Build Docker images
- ✅ Start all services
- ✅ Show you the access URLs

**Wait for the script to complete, then access:**

---

## 📍 Access the Application

Once the containers are running, open your browser:

| Service            | URL                        | Description                       |
| ------------------ | -------------------------- | --------------------------------- |
| 🌐 **Frontend**    | http://localhost:8081      | React/Expo Web Application        |
| ⚡ **Backend API** | http://localhost:8000      | FastAPI REST API Server           |
| 📚 **API Docs**    | http://localhost:8000/docs | Interactive Swagger Documentation |

---

## 🛠️ Development Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Stop Services

```bash
docker-compose stop
```

### Restart Services

```bash
docker-compose restart
```

### Check Service Status

```bash
docker-compose ps
```

---

## 🧹 Cleanup (When Done Working)

To free up Docker storage and remove all containers/images:

```bash
./cleanup-docker.sh
```

This will:

- ✅ Remove all project containers
- ✅ Remove all project images
- ✅ Free up disk space
- ✅ **Your code files remain safe!**

**Note:** You'll need to run `./start-docker.sh` again to restart the project.

---

## 🔄 Complete Developer Workflow

```bash
# 1. Start working
./start-docker.sh

# 2. Develop your features
# - Frontend code in ./frontend/
# - Backend code in ./backend/
# - Changes auto-reload in containers!

# 3. View logs if needed
docker-compose logs -f

# 4. When done for the day
./cleanup-docker.sh

# 5. Next time, start again
./start-docker.sh
```

---

## 📂 Project Structure

```
bhadli-kavya/
├── backend/              # FastAPI backend
│   ├── Dockerfile
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── routers/
│   └── requirements.txt
├── frontend/             # React/Expo frontend
│   ├── Dockerfile
│   ├── App.jsx
│   ├── package.json
│   ├── components/
│   ├── screens/
│   └── services/
├── docker-compose.yml    # Service orchestration
├── start-docker.sh       # Start script ⭐
├── cleanup-docker.sh     # Cleanup script 🧹
├── .env                  # Your environment variables (DO NOT COMMIT)
└── .env.example          # Environment template
```

---

## 🔒 Database Configuration

### Option 1: Aiven Cloud MySQL (Recommended)

1. Create a free MySQL database on [Aiven](https://aiven.io)
2. Get your connection details from Aiven console
3. Update `.env` file with your Aiven credentials:

```bash
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=21638
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password
DB_NAME=defaultdb
DB_SSL_MODE=REQUIRED
```

### Option 2: Local MySQL Database

To use a local MySQL database instead:

1. Uncomment the `database` service in `docker-compose.yml`
2. Update `.env` file:

```bash
DB_HOST=database
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=bhadli_kavya
DB_SSL_MODE=DISABLED
```

3. Run `./start-docker.sh`

---

## 🐛 Troubleshooting

### Port Already in Use

If ports 8000 or 8081 are already in use:

1. Edit `.env` file:

```bash
API_PORT=9000       # Change backend port
FRONTEND_PORT=9001  # Change frontend port
```

2. Restart:

```bash
./start-docker.sh
```

### Database Connection Error

Check your `.env` file has correct database credentials:

```bash
cat .env
```

View backend logs for detailed error:

```bash
docker-compose logs backend
```

### Container Won't Start

Rebuild from scratch:

```bash
./cleanup-docker.sh
./start-docker.sh
```

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 Important Notes

- ⚠️ **Never commit your `.env` file!** It contains sensitive credentials
- ✅ The `.env` file is already in `.gitignore`
- ✅ Always use `.env.example` as a template
- ✅ Hot reload is enabled - your code changes reflect immediately
- ✅ Database data persists between restarts (when using local database)

---

## 🎉 You're All Set!

Just run:

```bash
./start-docker.sh
```

Then open **http://localhost:8081** in your browser!

Happy coding! 🚀

---

## 📞 Need Help?

- Check the logs: `docker-compose logs -f`
- Check service status: `docker-compose ps`
- Rebuild everything: `./cleanup-docker.sh && ./start-docker.sh`

---

**Made with ❤️ by the Bhadli Kavya Team**
