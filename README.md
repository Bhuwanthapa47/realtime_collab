# realtime-collab

This repository contains a full-stack realtime collaboration app (frontend + backend) prepared for submission.

**Contents**
- Frontend: `frontend/` (React)
- Backend: `realtime-collab/` (Spring Boot, Maven)

**Quick Start (Windows)**

1. Backend

   - Build:
     ```powershell
     cd realtime-collab
     ./mvnw clean package
     ```

   - Run:
     ```powershell
     cd realtime-collab
     ./mvnw spring-boot:run
     ```

   The backend runs by default on `http://localhost:8080`.

2. Frontend

   - Install and run:
     ```powershell
     cd frontend
     npm install
     npm start
     ```

   Frontend runs on `http://localhost:3000` and communicates with the backend.

**Architecture**

- Backend: Spring Boot application under `realtime-collab/src/main/java/com/collab/realtime_collab/`.
  - Packages: `auth`, `user`, `board`, `list`, `task`, `activity`, `websocket`, etc.
  - Typical controllers expose REST endpoints under `/api/*`.

- Frontend: React app under `frontend/` using services in `src/services/` to call the backend and a `websocketService` for realtime updates.

Design trade-offs and assumptions

- Authentication: Simple JWT or session-based auth is used (see `auth` package). For submission/demo purposes, security is minimal and intended for evaluation rather than production.
- Persistence: Uses an embedded or configured relational DB (see `application.properties`). For easy evaluation, an in-memory DB may be used during tests.
- Build artifacts: Per request, build artifacts may be included; you can remove them and use `.gitignore` to exclude them if desired.

API Documentation (endpoints discovered in code)

- `POST /api/auth/login` — authenticate and receive token (check `auth` package)
- `POST /api/auth/register` — register a new user

- `GET /api/users` — list users
- `GET /api/users/{userId}` — get user details

- `POST /api/boards` — create board
- `GET /api/boards` — list boards

- `POST /api/task-lists` — create task list
- `GET /api/task-lists/board/{boardId}` — lists for a board
- `PUT /api/task-lists/{id}` — update list
- `DELETE /api/task-lists/{id}` — delete list

- `POST /api/tasks` — create task
- `GET /api/tasks/list/{listId}` — tasks in a list
- `PUT /api/tasks/{taskId}/assign` — assign task
- `PUT /api/tasks/{taskId}/reorder` — reorder within list
- `PUT /api/tasks/{taskId}/move` — move task between lists
- `PUT /api/tasks/{taskId}` — update task
- `DELETE /api/tasks/{taskId}` — delete task
- `GET /api/tasks/paged` — paged tasks
- `GET /api/tasks/search` — search tasks

- `WebSocket` endpoints: See `websocket` package and `websocketService` in frontend for realtime events.

Demo credentials (placeholders)

- Username: `demo@example.com`
- Password: `Password123!`


