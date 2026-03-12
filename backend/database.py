import mysql.connector
from dotenv import load_dotenv
import os

# Load the .env file from the parent directory of backend
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=env_path)

# Base database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'bhadli_kavya'),
    'autocommit': True
}

# Add SSL configuration if required (for Aiven cloud database)
ssl_mode = os.getenv('DB_SSL_MODE', 'DISABLED')
if ssl_mode == 'REQUIRED':
    DB_CONFIG['ssl_disabled'] = False
    # Aiven provides SSL automatically, we just need to enable it
    print("🔒 SSL/TLS encryption enabled for database connection")
else:
    DB_CONFIG['ssl_disabled'] = True

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

        temp_config = DB_CONFIG.copy()
        database_name = temp_config.pop('database')

        conn = mysql.connector.connect(**temp_config)
        cursor = conn.cursor()

        # --------------------------------------------------
        # 1️⃣ Create Database
        # --------------------------------------------------
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{database_name}`")
        cursor.execute(f"USE `{database_name}`")

        # --------------------------------------------------
        # 2️⃣ USERS TABLE
        # --------------------------------------------------
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name VARCHAR(255),
            uid VARCHAR(255) UNIQUE,
            auth_provider VARCHAR(50) DEFAULT 'email',
            location VARCHAR(255),
            calendar_preference VARCHAR(50) DEFAULT 'gregorian',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        """)

        # --------------------------------------------------
        # 3️⃣ SESSIONS TABLE
        # --------------------------------------------------
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            session_id CHAR(36) PRIMARY KEY,
            user_id INT NOT NULL,
            title TEXT,
            status VARCHAR(20) DEFAULT 'active',
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ended_at TIMESTAMP NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """)

        # --------------------------------------------------
        # 4️⃣ MESSAGES TABLE
        # --------------------------------------------------
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            message_id CHAR(36) PRIMARY KEY,
            session_id CHAR(36),
            user_id INT NOT NULL,
            role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'model')),
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE SET NULL
        )
        """)

        # ✅ Create indexes manually if they don't exist
        def ensure_index(table, index_name, index_sql):
            cursor.execute(f"""
                SELECT COUNT(*) FROM information_schema.statistics
                WHERE table_schema = DATABASE()
                AND table_name = '{table}'
                AND index_name = '{index_name}'
            """)
            if cursor.fetchone()[0] == 0:
                cursor.execute(index_sql)

        ensure_index("messages", "idx_messages_user_id_created_at",
            "CREATE INDEX idx_messages_user_id_created_at ON messages(user_id, created_at DESC)")
        ensure_index("messages", "idx_messages_session_created_at",
            "CREATE INDEX idx_messages_session_created_at ON messages(session_id, created_at DESC)")

        # --------------------------------------------------
        # 5️⃣ POEMS TABLE
        # --------------------------------------------------
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS poems (
            poem_id CHAR(36) PRIMARY KEY,
            poem TEXT NOT NULL,
            language VARCHAR(100) NOT NULL,
            season VARCHAR(50) NOT NULL,
            location VARCHAR(150) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        ensure_index("poems", "idx_poems_language",
            "CREATE INDEX idx_poems_language ON poems(language)")
        ensure_index("poems", "idx_poems_season",
            "CREATE INDEX idx_poems_season ON poems(season)")
        ensure_index("poems", "idx_poems_location",
            "CREATE INDEX idx_poems_location ON poems(location)")

        # --------------------------------------------------
        # 6️⃣ CALENDAR TABLE
        # --------------------------------------------------
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS calendar (
            id INT AUTO_INCREMENT PRIMARY KEY,
            gregorian_date DATE NOT NULL,
            day VARCHAR(20),
            hindi_date VARCHAR(255),
            gujarati_date VARCHAR(255),
            bengali_date VARCHAR(255),
            rajasthani_date VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (gregorian_date)
            )
        """)

        ensure_index("calendar", "idx_calendar_gregorian",
            "CREATE INDEX idx_calendar_gregorian ON calendar(gregorian_date)")
        
        


        # --------------------------------------------------
        # 7️⃣ STATES TABLE
        # --------------------------------------------------
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS states (
            id INT AUTO_INCREMENT PRIMARY KEY,
            state_name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # --------------------------------------------------
        # 8️⃣ DISTRICTS TABLE
        # --------------------------------------------------
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS districts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            state_id INT NOT NULL,
            district_name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(state_id, district_name),
            FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
        )
        """)

        # --------------------------------------------------
        # 9️⃣ POEM DISTRICT STATS TABLE
        # --------------------------------------------------
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS poem_district_stats (
            id INT AUTO_INCREMENT PRIMARY KEY,
            poem_id CHAR(36) NOT NULL,
            district_id INT NOT NULL,
            score FLOAT,
            count INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(poem_id, district_id),
            FOREIGN KEY (poem_id) REFERENCES poems(poem_id) ON DELETE CASCADE,
            FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
        )
        """)

        # Indexes for fast search
        ensure_index("districts", "idx_districts_state",
            "CREATE INDEX idx_districts_state ON districts(state_id)")

        ensure_index("poem_district_stats", "idx_poem_stats_poem",
            "CREATE INDEX idx_poem_stats_poem ON poem_district_stats(poem_id)")

        ensure_index("poem_district_stats", "idx_poem_stats_district",
            "CREATE INDEX idx_poem_stats_district ON poem_district_stats(district_id)")


        conn.commit()
        conn.close()
        print("✅ Database and all tables created successfully (aligned with API documentation).")



    except mysql.connector.Error as err:
        print(f"❌ Database initialization error: {err}")
        raise

