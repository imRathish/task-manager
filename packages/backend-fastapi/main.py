from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import datetime

app = FastAPI()

# Allow all origins (same as Node.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

DATABASE = "./taskmanager.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            preferences TEXT
        )
    """)
    # Create tasks table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            deadline TEXT,
            priority TEXT,
            status TEXT DEFAULT 'pending',
            assigned_to INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_to) REFERENCES users(id)
        )
    """)
    # Create comments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            user_id INTEGER,
            comment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (task_id) REFERENCES tasks(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    conn.commit()
    # Seed predefined users if table is empty
    cursor.execute("SELECT COUNT(*) AS count FROM users")
    row = cursor.fetchone()
    if row["count"] == 0:
        print("Seeding database with predefined users...")
        insert = "INSERT INTO users (name, email, preferences) VALUES (?, ?, ?)"
        predefined_users = [
            {"name": "Alice", "email": "alice@example.com", "preferences": "{}"},
            {"name": "Bob", "email": "bob@example.com", "preferences": "{}"},
            {"name": "Charlie", "email": "charlie@example.com", "preferences": "{}"},
            {"name": "Dave", "email": "dave@example.com", "preferences": "{}"},
            {"name": "Eve", "email": "eve@example.com", "preferences": "{}"}
        ]
        for user in predefined_users:
            cursor.execute(insert, (user["name"], user["email"], user["preferences"]))
            print(f"Inserted user {user['name']} with id {cursor.lastrowid}")
        conn.commit()
    else:
        print("Predefined users already exist, skipping seeding.")
    conn.close()

init_db()

# ---------------------------
# Users Endpoints
# ---------------------------
@app.get("/api/users")
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()
    # Convert each row to a dict
    return {"data": [dict(row) for row in rows]}

@app.post("/api/users")
def create_user(user: dict):
    name = user.get("name")
    email = user.get("email")
    preferences = user.get("preferences") or ""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (name, email, preferences) VALUES (?, ?, ?)",
                       (name, email, preferences))
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return {"message": "User added successfully", "data": {"id": user_id, "name": name, "email": email, "preferences": preferences}}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))

# ---------------------------
# Tasks Endpoints
# ---------------------------
@app.get("/api/tasks")
def get_tasks():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks")
    rows = cursor.fetchall()
    conn.close()
    return {"data": [dict(row) for row in rows]}

@app.get("/api/tasks/{task_id}")
def get_task(task_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"data": dict(row)}

@app.post("/api/tasks")
def create_task(task: dict):
    title = task.get("title")
    description = task.get("description")
    deadline = task.get("deadline")
    priority = task.get("priority")
    assigned_to = task.get("assigned_to")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO tasks (title, description, deadline, priority, assigned_to) VALUES (?, ?, ?, ?, ?)",
                   (title, description, deadline, priority, assigned_to))
    conn.commit()
    task_id = cursor.lastrowid
    conn.close()
    return {"message": "Task added successfully", "data": {"id": task_id, "title": title, "description": description, "deadline": deadline, "priority": priority, "assigned_to": assigned_to}}

@app.put("/api/tasks/{task_id}")
def update_task(task_id: int, task: dict):
    title = task.get("title")
    description = task.get("description")
    deadline = task.get("deadline")
    priority = task.get("priority")
    status = task.get("status")
    assigned_to = task.get("assigned_to")
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        UPDATE tasks SET 
          title = COALESCE(?, title), 
          description = COALESCE(?, description), 
          deadline = COALESCE(?, deadline),
          priority = COALESCE(?, priority),
          status = COALESCE(?, status),
          assigned_to = COALESCE(?, assigned_to)
        WHERE id = ?
    """
    cursor.execute(query, (title, description, deadline, priority, status, assigned_to, task_id))
    conn.commit()
    conn.close()
    return {"message": "Task updated successfully"}

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"message": "Task deleted successfully"}

# ---------------------------
# Comments Endpoints
# ---------------------------
@app.get("/api/tasks/{task_id}/comments")
def get_comments(task_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM comments WHERE task_id = ?", (task_id,))
    rows = cursor.fetchall()
    conn.close()
    return {"data": [dict(row) for row in rows]}

@app.post("/api/tasks/{task_id}/comments")
def create_comment(task_id: int, comment: dict):
    user_id = comment.get("user_id")
    text = comment.get("comment")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO comments (task_id, user_id, comment) VALUES (?, ?, ?)",
                   (task_id, user_id, text))
    conn.commit()
    comment_id = cursor.lastrowid
    conn.close()
    return {"message": "Comment added successfully", "data": {"id": comment_id, "taskId": task_id, "user_id": user_id, "comment": text}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)
