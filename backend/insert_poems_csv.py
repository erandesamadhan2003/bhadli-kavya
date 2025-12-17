import csv
import uuid
from backend import database  # ensure you're running this from project root

def insert_poems_from_csv(csv_path):
    conn = database.get_connection()
    cursor = conn.cursor()

    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        count = 0

        for row in reader:
            # Match column names from your CSV to DB fields
            poem_text = row.get("Poems") or row.get("poem")
            language = row.get("language")
            season = row.get("season")
            location = row.get("location")

            # Skip invalid rows
            if not all([poem_text, language, season, location]):
                print(f"⚠️ Skipped incomplete row: {row}")
                continue

            # Insert into poems table
            cursor.execute("""
                INSERT INTO poems (poem_id, poem, language, season, location)
                VALUES (%s, %s, %s, %s, %s)
            """, (str(uuid.uuid4()), poem_text.strip(), language.strip(), season.strip(), location.strip()))
            
            count += 1

    conn.commit()
    conn.close()
    print(f"✅ Successfully inserted {count} poems into the database!")

# --- Run the importer ---
if __name__ == "__main__":
    csv_file_path = "D:/Bhadali Kavya/poems.csv"  # Update with your actual CSV path
    insert_poems_from_csv(csv_file_path)
