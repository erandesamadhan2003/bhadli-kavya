import mysql.connector
from dotenv import load_dotenv
import os

# Load the .env file from the parent directory of backend
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=env_path)


DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'bhadli_kavya'),
    'autocommit': True
}

def get_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"❌ Database connection error: {err}")
        raise

def init_db():
    try:
        print("🔍 Loaded DB Config:", DB_CONFIG)
        # First connect without database to create it if it doesn't exist
        temp_config = DB_CONFIG.copy()
        database_name = temp_config.pop('database')
        
        conn = mysql.connector.connect(**temp_config)
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{database_name}`")
        cursor.execute(f"USE `{database_name}`")
        
        # Create users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name VARCHAR(255),
            uid VARCHAR(255) UNIQUE,
            auth_provider VARCHAR(50) DEFAULT 'email',
            photoURL TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        """)
        
         # calendar table (for CSV)
        # calendar table (for CSV)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS calendar (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vikram_samvat_date VARCHAR(255),
            gregorian_date VARCHAR(255),
            calendar_type VARCHAR(50)
        )
        """)

        
        conn.commit()
        conn.close()
        print("✅ Database and tables created successfully")
        
    except mysql.connector.Error as err:
        print(f"❌ Database initialization error: {err}")
        raise


