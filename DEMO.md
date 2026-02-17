# Demo & Submission Checklist

This file contains concise instructions to run the project, demo credentials, a short submission checklist, and API examples.

## Quick run (Windows)

1. Start the backend

```powershell
cd realtime-collab
./mvnw spring-boot:run
```

Backend default: `http://localhost:8080`

2. Start the frontend

```powershell
cd frontend
npm install
npm start
```

Frontend default: `http://localhost:3000`

3. Open the app in a browser and use demo credentials below.

## Demo credentials (for evaluation)

- Email: `demo@example.com`
- Password: `Password123!`

These are placeholder accounts for demonstration only. Create additional users via the registration endpoint if needed.

## API examples

Authenticate (login) — returns auth token (JWT) or session cookie depending on configuration:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Password123!"}'
```

Register:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"new@user.com","password":"NewPass123!","name":"New User"}'
```

Create a board (requires auth token in `Authorization: Bearer <token>` header):

```bash
curl -X POST http://localhost:8080/api/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Demo Board"}'
```

Create a task:

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Demo Task","description":"Do something","listId":1}'
```

## WebSocket / Realtime

- The backend exposes WebSocket endpoints configured in the `websocket` package; the frontend uses `src/services/websocketService.js` to connect and listen for realtime events (task created/updated/moved).

## Architecture notes, assumptions & trade-offs

- Backend: Spring Boot with layered packages (`controller`, `service`, `repository`) for clarity and testability.
- Frontend: React with small service modules under `src/services/` to keep API calls and websocket logic centralized.
- Authentication: Simple JWT/session approach. For submission ease, security is pragmatic rather than enterprise-hardened.
- Persistence: Project supports an external DB via `application.properties`; for quick testing the existing configuration may use an embedded DB.
- Trade-offs: Prioritized clarity and a working demo over production concerns like horizontal scaling, secure secret management, and exhaustive input validation.

## Notes for graders

- To reproduce the demo quickly: start the backend, start the frontend, use the demo credentials to log in, create a board and tasks, and observe realtime updates across multiple browser windows.
