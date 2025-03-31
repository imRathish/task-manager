# Task Manager Application

This repository contains a simple Task Manager application built using React and SCSS. The project demonstrates best practices in code organization, modularity, and styling conventions, resulting in a maintainable and scalable codebase.

---

## Project Overview

The Task Manager application allows users to create, update, and manage tasks along with collaborating via comments. The application is built with UI inspired by Atlassian products, featuring responsive design and subtle animations. The frontend is developed in React with SCSS for styling, while the backend is built using FastAPI in Python.


This setup allows you to run both parts of the application concurrently using a single command.

---


## Tech Stack

### Frontend
- **Framework:** React (using Vite for fast builds)
- **Styling:** Plain SCSS following BEM
- **Routing:** React Router for client-side navigation
- **Font:** Roboto (loaded via Google Fonts)

### Backend
- **Framework:** FastAPI for building a high-performance API
- **Database:** SQLite for data persistence
- **CORS:** Configured via FastAPI's CORSMiddleware to allow cross-origin requests
- **Deployment:** The backend runs with Uvicorn on port 5001 within a Python virtual environment
 
## Database Schema

The backend database is designed to support a simple Task Manager application with the following entities:

- **users**: Stores user information.
- **tasks**: Stores task details such as title, description, deadline, priority, status, and the assigned user.
- **comments**: Stores comments made on tasks, linking back to both the task and the commenting user.

Below is the DBML representation of the database schema:

```dbml
// DBML for Task Manager Database

Table users {
  id int [pk, increment]
  name varchar(255) [not null]
  email varchar(255) [unique, not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table tasks {
  id int [pk, increment]
  title varchar(255) [not null]
  description text
  deadline date
  priority varchar(50) [not null, default: 'Medium']
  status varchar(50) [not null, default: 'pending']
  assigned_to int [ref: > users.id, null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table comments {
  id int [pk, increment]
  task_id int [ref: > tasks.id]
  user_id int [ref: > users.id]
  comment text [not null]
  created_at timestamp [default: `now()`]
}
```

## How It Works

- **User Sign In:**  
  When a user opens the app, if no session is found (currently using session storage), a simple sign-in screen is displayed with a dropdown to select one of the predefined users. The selected user is stored in session storage and used throughout the app. 
  (*Predfined users are used for simplicity*)

- **Task Management:**  
  Users can create new tasks and update task details. Tasks display key details such as title, priority, status, and assignee.

- **Comments & Collaboration:**  
  Each task detail page features a comments section that allows users to collaborate in real time. New comments are added at the top, and existing comments are displayed in reverse chronological order.

- **Real-Time Updates:**  
  Changes to task details update immediately without requiring a manual save, providing an inline-editing experience.

## Best Practices and Principles

### Code Organization
- **Monorepo:** Both frontend and backend codebases are managed within a single repository, simplifying development, dependency management, and deployment.
- **Component-Based Architecture:** The React frontend is built using modular, reusable components, each with its own SCSS file for localized styling.
- **Separation of Concerns:** API calls, UI logic, and styling are clearly separated to enhance maintainability and scalability.

### Frontend Development
- **Functional Components & Hooks:** Utilizes React’s functional components with hooks (`useState`, `useEffect`) for managing component state and side effects.
- **Routing & Navigation:**  
  React Router is used to handle client-side navigation, keeping the app modular and the UI responsive.
- **BEM Naming Conventions:**  
  CSS classes are organized using the BEM (Block, Element, Modifier) methodology to ensure modular and easily maintainable styles.
### Backend Development
- **FastAPI:** Provides a high-performance API with automatic interactive documentation.
- **SQLite:** A lightweight database solution used for quick development and easy deployment.
- **RESTful Endpoints:** The backend exposes endpoints for managing users, tasks, and comments with a consistent response structure.

## Limitations and Areas for Improvement

### State Management and components
- **Local State Only:**  
  The application relies on local component state (via React hooks) rather than a global state management solution like Redux. This decision was made for simplicity given the current scope.
- **Components & Storybook:**  
  Components like Buttons, Modals, input etc should be standalone component and all such atomic components must be included in the stoybook for easy development collaboration and experience


### Error Handling
- **Basic Error Handling:**  
  Error handling is implemented in API calls; however, a more robust solution (e.g., global error boundaries or user-friendly error messages) is needed for production.

### Performance and Optimization
- **Code Splitting and Lazy Loading:**  
  These optimizations are not implemented in the current version but would be essential for larger applications.
  
### Accessibility & Internationalization
- **Accessibility Enhancements:**  
  While basic accessibility practices are followed (such as proper form labels), additional work is needed to meet full accessibility standards.
- **No Internationalization (i18n):**  
  The project does not currently support multiple languages.


## Getting Started

### Prerequisites
- **Node.js & pnpm:** For managing the frontend code.
- **Python 3.9+:** For running the FastAPI backend.
- **Virtual Environment:** Create and activate a virtual environment in the backend directory.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd task-manager
2. **Install Frontend Dependencies:**
   ```bash
   pnpm install
3. **Install Backend Dependencies:**:
    *Navigate to `packages/backend-fastapi` and set up your Python virtual environment*
   ```bash
   cd packages/backend-fastapi
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install fastapi uvicorn
4. **Running the Application:**
   ```bash
   pnpm start
This command uses concurrently to:

- Run the FastAPI backend from packages/backend-fastapi using Uvicorn on port 5001 (via the virtual environment).

- Run the React frontend in development mode.



## Conclusion

This Task Manager application demonstrates a modular approach to building web applications by following modern React best practices and SCSS methodologies. By centralizing API calls, reusing common styles via shared SCSS partials, and using functional components with hooks, the project is designed to be scalable and maintainable. Although there are areas for further enhancement—such as global state management, testing, advanced error handling, and performance optimizations—this project provides a solid foundation and a clear demonstration of coding best practices.

