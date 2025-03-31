import os
import sqlite3
import pytest
from fastapi.testclient import TestClient
from main import app, init_db

client = TestClient(app)

# Fixture to reset the database before tests
@pytest.fixture(autouse=True)
def run_before_tests():
    # Remove existing database file if it exists
    db_path = "taskmanager.db"
    if os.path.exists(db_path):
        os.remove(db_path)
    # Reinitialize the database with seed data
    init_db()

def test_get_users():
    response = client.get("/api/users")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert isinstance(data["data"], list)
    # Ensure at least 5 predefined users are present
    assert len(data["data"]) >= 5

def test_create_user():
    new_user = {"name": "TestUser", "email": "testuser@example.com", "preferences": "{}"}
    response = client.post("/api/users", json=new_user)
    assert response.status_code == 200
    data = response.json()
    assert data.get("message") == "User added successfully"
    assert "data" in data
    assert "id" in data["data"]

def test_task_crud_and_comments():
    # Create a new task
    task_payload = {
        "title": "Test Task",
        "description": "This is a test task",
        "deadline": "2024-12-31",
        "priority": "Medium",
        "assigned_to": 1
    }
    response = client.post("/api/tasks", json=task_payload)
    assert response.status_code == 200
    task_data = response.json()["data"]
    task_id = task_data["id"]

    # Verify task creation
    response = client.get(f"/api/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["title"] == "Test Task"

    # Update the task
    update_payload = {
        "title": "Test Task Updated",
        "description": "Updated description",
        "deadline": "2024-11-30",
        "priority": "High",
        "status": "in-progress",
        "assigned_to": 2
    }
    response = client.put(f"/api/tasks/{task_id}", json=update_payload)
    assert response.status_code == 200

    # Verify the update
    response = client.get(f"/api/tasks/{task_id}")
    updated_task = response.json()["data"]
    assert updated_task["title"] == "Test Task Updated"
    assert updated_task["priority"] == "High"
    assert updated_task["status"] == "in-progress"

    # Create a comment for the task
    comment_payload = {"user_id": 1, "comment": "This is a test comment"}
    response = client.post(f"/api/tasks/{task_id}/comments", json=comment_payload)
    assert response.status_code == 200
    comment_data = response.json()["data"]
    assert comment_data["comment"] == "This is a test comment"

    # Verify that the comment appears in the comments list
    response = client.get(f"/api/tasks/{task_id}/comments")
    comments = response.json()["data"]
    assert any(c["comment"] == "This is a test comment" for c in comments)

    # Delete the task
    response = client.delete(f"/api/tasks/{task_id}")
    assert response.status_code == 200

    # Verify deletion (should return 404)
    response = client.get(f"/api/tasks/{task_id}")
    assert response.status_code == 404
