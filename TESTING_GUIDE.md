# Testing Guide - Realtime Collaboration App

## Prerequisites
- Backend running on http://localhost:8080
- Frontend running on http://localhost:3000
- MySQL database running with `collab_app` database

## Test Scenarios

### 1. Authentication Testing

#### Test 1.1: User Registration
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
4. Click "Sign Up"
5. **Expected**: Should redirect to login page

#### Test 1.2: User Login
1. Fill in:
   - Email: "john@example.com"
   - Password: "password123"
2. Click "Login"
3. **Expected**: Should redirect to boards page and show "Welcome" message

---

### 2. Board Management Testing

#### Test 2.1: Create Board
1. After login, click "Create New Board"
2. Fill in:
   - Board Name: "Project Alpha"
   - Description: "Main project board"
3. Click "Create Board"
4. **Expected**: Board should appear in the grid

#### Test 2.2: View Board
1. Click on "Project Alpha" board
2. **Expected**: Board detail page should load with empty lists

---

### 3. List Management Testing

#### Test 3.1: Create Task List
1. On board detail page, click "Add List"
2. Enter list name: "To Do"
3. Click "Create List"
4. **Expected**: List appears in the board with empty state

#### Test 3.2: Update List Name
1. Click on list name
2. Type new name: "Backlog"
3. Press Enter
4. **Expected**: List name updates immediately

#### Test 3.3: Delete List
1. Click trash icon on list header
2. **Expected**: List should be removed from board

---

### 4. Task Management Testing

#### Test 4.1: Create Task
1. Click "+ Add Task" in any list
2. Fill in:
   - Title: "Fix login bug"
   - Description: "Debug authentication issue"
3. Click "Add Task"
4. **Expected**: Task appears in the list with PENDING status

#### Test 4.2: Edit Task
1. Click on any task card
2. Edit the title and description
3. Click "Save"
4. **Expected**: Task updates in the list

#### Test 4.3: Change Task Status
1. Click the status button (▶️ for PENDING, ⏩ for IN_PROGRESS, ↩️ for COMPLETED)
2. **Expected**: Status cycles through: PENDING → IN_PROGRESS → COMPLETED → PENDING

#### Test 4.4: Delete Task
1. Click trash icon on task
2. Confirm deletion
3. **Expected**: Task is removed from list

---

### 5. User Assignment Testing

#### Test 5.1: Assign User to Task
1. Click the 👤 icon on any task
2. Select a user from the dropdown (e.g., "John Doe")
3. **Expected**: Task shows "@ John Doe" label

#### Test 5.2: Verify Assignment
1. Checkmark (✓) appears next to assigned user's name
2. Task displays assigned user below status badge
3. **Expected**: Visual confirmation of assignment

---

### 6. Drag and Drop Testing

#### Test 6.1: Drag Task Between Lists
1. Create at least 2 lists with tasks
2. Click and hold on a task card
3. Drag to another list
4. Release to drop
5. **Expected**: 
   - Task disappears from source list
   - Task appears in target list
   - Grab cursor shows while dragging
   - Target list highlights in blue

#### Test 6.2: Verify Task Position
1. Drag task to a specific list
2. Refresh the page
3. **Expected**: Task remains in the target list (persisted to backend)

---

### 7. Search Testing

#### Test 7.1: Search Tasks by Title
1. On board page, find search input at the top
2. Type in search box: "login"
3. **Expected**: Results appear showing matching tasks with:
   - Task title
   - Task description
   - List name
   - Status badge

#### Test 7.2: Clear Search
1. Type search query
2. Click "×" button to clear search
3. **Expected**: Search results disappear, board view returns

#### Test 7.3: Minimum Characters
1. Type only 1 character
2. **Expected**: No search results shown (requires min 2 characters)

#### Test 7.4: No Results
1. Search for non-existent task: "xyz123"
2. **Expected**: Message "No tasks found matching 'xyz123'"

---

### 8. Activity History Testing

#### Test 8.1: View Activity History
1. Perform any action (create task, assign user, etc.)
2. Look at right sidebar "Recent Activity" panel
3. **Expected**: Activity appears with:
   - Activity icon (➕ for create, ✏️ for update, etc.)
   - User name who performed action
   - Description of action
   - Relative timestamp (e.g., "Just now", "5m ago")

#### Test 8.2: Activity Types
Create and verify these activities appear:
- ➕ Task created
- ✏️ Task updated
- 🗑️ Task deleted
- ↔️ Task moved (drag between lists)
- 👤 Task assigned
- 📋 List created
- ✏️ List updated
- 🗑️ List deleted

#### Test 8.3: Activity Timestamps
1. Create a task
2. Wait a few seconds
3. Create another task
4. **Expected**: Different tasks show different timestamps in activity panel

---

### 9. Real-time Updates Testing

#### Test 9.1: Multi-User Updates (Requires 2 Browsers)
1. Open board in Browser 1: http://localhost:3000
2. Open same board in Browser 2: http://localhost:3000
3. Create a task in Browser 1
4. **Expected**: Task appears automatically in Browser 2 without refresh

#### Test 9.2: Real-time Notification
1. In Browser 1: Change task status
2. **Expected**: Status updates immediately in Browser 2

#### Test 9.3: Live Activity Feed
1. In Browser 2: Watch activity panel
2. In Browser 1: Create/edit/delete tasks
3. **Expected**: Each action appears instantly in Browser 2's activity panel

---

### 10. Edge Cases & Error Handling

#### Test 10.1: Search with Empty Query
1. Clear search box completely
2. **Expected**: No results shown, search results panel closes

#### Test 10.2: Task without Description
1. Create task with only title (leave description empty)
2. **Expected**: Task displays with empty description area

#### Test 10.3: Very Long Task Title
1. Create task with very long title (100+ characters)
2. **Expected**: Text wraps or truncates appropriately

#### Test 10.4: Drag Task to Same List
1. Try dragging task within same list
2. **Expected**: Either prevents drag or allows reordering

---

## Troubleshooting

### Search Not Working
- Check browser console for errors (F12 → Console tab)
- Verify backend search endpoint: `GET /api/tasks/search?q={query}`
- Ensure JWT token is present in Authorization header

### Activity Not Showing
- Refresh the page to reload activity panel
- Check if new activities are created (check browser console)
- Verify backend Activity table has data: `SELECT * FROM activity;`

### WebSocket Connection Issues
- Check browser console for connection errors
- Verify WebSocket is not blocked by firewall/proxy
- Ensure backend is running and `/ws` endpoint is accessible

### Task Not Saving After Edit
- Check network tab (F12 → Network) for failed requests
- Verify JWT token hasn't expired (24-hour validity)
- Check backend error logs

---

## Performance Notes

- Activity panel loads last 20 activities per board
- Search is case-insensitive
- Real-time updates via WebSocket (STOMP)
- Pagination ready for large task lists (implement "Load More" if needed)

---

## Browser Compatibility

Tested on:
- Chrome/Chromium 90+
- Firefox 88+
- Edge 90+

---

## Known Limitations

1. Activity logging doesn't include user context in some cases (fixed with latest build)
2. Real-time updates require WebSocket connection
3. Search returns all matching tasks (pagination optional)
4. No drag-and-drop reordering within same list yet (can be added)

---

## Success Indicators

✅ All tests pass without errors
✅ Activity panel shows recent actions
✅ Search returns relevant results
✅ Drag-and-drop works between lists
✅ Real-time updates visible in multiple browsers
✅ User assignments persist after refresh
✅ Task status changes are saved
