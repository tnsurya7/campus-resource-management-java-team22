# ✅ CRMS Frontend - Verification Checklist

## 🎯 Purpose
Use this checklist to verify that the frontend is properly set up and working correctly.

---

## 📦 Step 1: Installation Verification

### Check Files Exist
- [ ] `frontend/package.json` exists
- [ ] `frontend/.env` exists
- [ ] `frontend/index.html` exists
- [ ] `frontend/src/main.jsx` exists
- [ ] `frontend/src/App.jsx` exists
- [ ] `frontend/tailwind.config.js` exists

### Install Dependencies
```bash
cd frontend
npm install
```

- [ ] Installation completes without errors
- [ ] `node_modules` folder created
- [ ] No vulnerability warnings (or only low severity)

---

## 🚀 Step 2: Development Server

### Start Server
```bash
npm run dev
```

**Expected Output:**
```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

- [ ] Server starts without errors
- [ ] Port 5173 is used (or another if 5173 is busy)
- [ ] No compilation errors in terminal

---

## 🌐 Step 3: Browser Access

### Open Browser
Navigate to: `http://localhost:5173`

- [ ] Page loads successfully
- [ ] No blank white screen
- [ ] Login page appears
- [ ] Styling is applied (Tailwind CSS working)
- [ ] No console errors (press F12 to check)

---

## 🔐 Step 4: Backend Connection

### Check Backend
```bash
# In another terminal
cd backend
mvn spring-boot:run
```

- [ ] Backend starts on port 8080
- [ ] No startup errors

### Test Login Page
On the frontend login page:

- [ ] Dropdown appears
- [ ] Dropdown populates with users from backend
- [ ] If dropdown is empty, check:
  - [ ] Backend is running
  - [ ] Backend URL in `.env` is correct
  - [ ] CORS is configured in backend
  - [ ] Check browser console for errors

---

## 👤 Step 5: Login Flow

### Test Login
1. Select any user from dropdown
2. Click "Login"

**Expected:**
- [ ] Success toast appears ("Welcome, [username]!")
- [ ] Redirects to appropriate page:
  - Admin → Dashboard
  - Student/Staff → Resources
- [ ] Navbar shows user name and role
- [ ] Sidebar appears with navigation links

---

## 🧭 Step 6: Navigation

### Test Sidebar Links
Click each link in sidebar:

**For Admin:**
- [ ] Dashboard link works
- [ ] Users link works
- [ ] Resources link works
- [ ] All Bookings link works

**For Student/Staff:**
- [ ] Resources link works
- [ ] My Bookings link works
- [ ] Admin links NOT visible

### Test Navbar
- [ ] User name displays correctly
- [ ] User role displays correctly
- [ ] Logout button works
- [ ] After logout, redirects to login page

---

## 📊 Step 7: Dashboard (Admin Only)

### Login as Admin
- [ ] Dashboard page loads
- [ ] Four stat cards appear:
  - Total Users
  - Total Resources
  - Total Bookings
  - Total Approved Bookings
- [ ] Numbers display correctly
- [ ] Icons appear
- [ ] Cards are styled properly

---

## 👥 Step 8: User Management (Admin Only)

### View Users
- [ ] Users page loads
- [ ] Table displays all users
- [ ] Columns: ID, Name, Email, Role, Actions
- [ ] Role badges colored correctly

### Create User
1. Click "+ Add User"
2. Fill form
3. Submit

**Expected:**
- [ ] Modal opens
- [ ] Form has all fields (Name, Email, Role)
- [ ] Validation works (try empty fields)
- [ ] Email validation works (try invalid email)
- [ ] Success toast appears
- [ ] Modal closes
- [ ] Table refreshes with new user

### Edit User
1. Click "Edit" on any user
2. Modify fields
3. Submit

**Expected:**
- [ ] Modal opens with existing data
- [ ] Can modify fields
- [ ] Success toast appears
- [ ] Changes reflected in table

### Delete User
1. Click "Delete" on any user
2. Confirm deletion

**Expected:**
- [ ] Confirmation dialog appears
- [ ] After confirm, success toast appears
- [ ] User removed from table

---

## 🏢 Step 9: Resource Management

### View Resources (All Roles)
- [ ] Resources page loads
- [ ] Resource cards display
- [ ] Each card shows:
  - Name
  - Description
  - Type
  - Capacity
  - Available status
  - Book button

### Create Resource (Admin Only)
1. Click "+ Add Resource"
2. Fill form
3. Submit

**Expected:**
- [ ] Modal opens
- [ ] Form has all fields
- [ ] Type dropdown has options
- [ ] Capacity validation works (min 1)
- [ ] Success toast appears
- [ ] New resource appears

### Edit Resource (Admin Only)
- [ ] Edit button visible for admin
- [ ] Modal opens with existing data
- [ ] Can modify and save
- [ ] Changes reflected

### Delete Resource (Admin Only)
- [ ] Delete button visible for admin
- [ ] Confirmation dialog appears
- [ ] Resource deleted successfully

---

## 📅 Step 10: Booking Creation

### Book a Resource
1. Click "Book" on any available resource
2. Fill booking form:
   - Date (today or future)
   - Start time
   - End time

**Expected:**
- [ ] Modal opens with resource details
- [ ] Date picker works (min: today)
- [ ] Time pickers work
- [ ] Duration calculates automatically
- [ ] Warning shows if:
  - Student >1 hour
  - Staff >5 hours
- [ ] Can submit booking
- [ ] Success toast appears

### Test Validation
Try booking with:
- [ ] Past date (should not allow)
- [ ] End time before start time (backend validates)
- [ ] Student >1 hour (warning shows, backend validates)
- [ ] Staff >5 hours (warning shows, backend validates)

---

## 📋 Step 11: My Bookings (Student/Staff)

### View Own Bookings
- [ ] My Bookings page loads
- [ ] Shows only current user's bookings
- [ ] Each card shows:
  - Resource name
  - Date
  - Time
  - Status badge
  - Booking ID
- [ ] Status badges colored correctly:
  - PENDING (yellow)
  - APPROVED (green)
  - REJECTED (red)
- [ ] Rejection reason shows if rejected

---

## 📊 Step 12: All Bookings (Admin Only)

### View All Bookings
- [ ] All Bookings page loads
- [ ] Table shows all bookings from all users
- [ ] Columns: ID, User, Resource, Date, Time, Status, Actions

### Approve Booking
1. Find PENDING booking
2. Click "Approve"

**Expected:**
- [ ] Success toast appears
- [ ] Status changes to APPROVED
- [ ] Approve button disappears
- [ ] Reject button disappears

### Reject Booking
1. Find PENDING booking
2. Click "Reject"
3. Enter rejection reason
4. Submit

**Expected:**
- [ ] Modal opens
- [ ] Reason field is required
- [ ] Success toast appears
- [ ] Status changes to REJECTED
- [ ] Buttons disappear

### Delete Booking
1. Click "Delete" on any booking
2. Confirm

**Expected:**
- [ ] Confirmation dialog appears
- [ ] Success toast appears
- [ ] Booking removed from table

---

## ⚠️ Step 13: Error Handling

### Test Error Scenarios

**Duplicate Email (Users):**
1. Try creating user with existing email
- [ ] Error toast appears
- [ ] Shows "email already exists" message

**Time Slot Conflict (Bookings):**
1. Book a resource for specific time
2. Try booking same resource, same time
- [ ] Error toast appears (409 Conflict)
- [ ] Shows conflict message

**Unauthorized Access:**
1. Login as Student
2. Try accessing `/dashboard` directly in URL
- [ ] Shows "Access Denied" message
- [ ] OR redirects to allowed page

**Backend Down:**
1. Stop backend server
2. Try any action
- [ ] Error toast appears
- [ ] Shows appropriate error message

---

## 📱 Step 14: Responsive Design

### Test Different Screen Sizes

**Desktop (1920px):**
- [ ] Layout looks good
- [ ] All elements visible
- [ ] No overflow

**Laptop (1366px):**
- [ ] Layout adjusts properly
- [ ] Sidebar visible
- [ ] Content readable

**Tablet (768px):**
- [ ] Layout responsive
- [ ] Cards stack properly
- [ ] Tables scroll horizontally if needed

**Mobile (375px):**
- [ ] Layout mobile-friendly
- [ ] Navigation accessible
- [ ] Forms usable
- [ ] Text readable

---

## 🎨 Step 15: UI/UX Verification

### Visual Elements
- [ ] Colors consistent
- [ ] Fonts readable
- [ ] Buttons have hover effects
- [ ] Links change color on hover
- [ ] Active nav link highlighted
- [ ] Loading spinners appear during data fetch
- [ ] Empty states show when no data
- [ ] Toast notifications appear and disappear

### Interactions
- [ ] Buttons clickable
- [ ] Forms submittable
- [ ] Modals open and close
- [ ] Confirmations work
- [ ] Dropdowns work
- [ ] Date/time pickers work

---

## 🔒 Step 16: Security Verification

### Check Headers
Open browser DevTools → Network tab:

1. Make any API call
2. Check request headers

**Expected:**
- [ ] `X-User-Id` header present
- [ ] Header value matches logged-in user ID
- [ ] Header sent automatically (no manual code needed)

### Check Role Protection
- [ ] Student cannot access admin pages
- [ ] Staff cannot access admin pages
- [ ] Admin can access all pages
- [ ] Unauthorized access shows error or redirects

---

## 🧪 Step 17: Complete User Flow

### End-to-End Test

**As Student:**
1. [ ] Login as student
2. [ ] Go to Resources
3. [ ] Book a resource (1 hour)
4. [ ] Go to My Bookings
5. [ ] See booking with PENDING status
6. [ ] Logout

**As Admin:**
7. [ ] Login as admin
8. [ ] Go to All Bookings
9. [ ] Find student's booking
10. [ ] Approve the booking
11. [ ] Logout

**As Student Again:**
12. [ ] Login as same student
13. [ ] Go to My Bookings
14. [ ] See booking with APPROVED status

**Expected:**
- [ ] All steps work smoothly
- [ ] Status updates correctly
- [ ] No errors in console

---

## 📊 Step 18: Performance Check

### Loading Times
- [ ] Initial page load <3 seconds
- [ ] Navigation between pages instant
- [ ] API calls complete quickly
- [ ] No lag when typing in forms

### Browser Console
Press F12 → Console tab:
- [ ] No red errors
- [ ] No yellow warnings (or only minor ones)
- [ ] No 404 errors for assets

### Network Tab
Press F12 → Network tab:
- [ ] All API calls return 200 (success)
- [ ] Or appropriate status codes (400, 403, 404, 409)
- [ ] No failed requests (except intentional error tests)

---

## 📝 Step 19: Code Quality

### Check Files
- [ ] No syntax errors
- [ ] Code is formatted properly
- [ ] Comments where needed
- [ ] No console.log statements (or only for debugging)

### Check Configuration
- [ ] `.env` file has correct API URL
- [ ] `package.json` has all dependencies
- [ ] `tailwind.config.js` configured
- [ ] No hardcoded values (use environment variables)

---

## 📚 Step 20: Documentation

### Check Documentation Files
- [ ] `README.md` exists and is complete
- [ ] `QUICKSTART.md` exists
- [ ] `TESTING_CHECKLIST.md` exists
- [ ] `PROJECT_SUMMARY.md` exists
- [ ] `DEPLOYMENT.md` exists
- [ ] All docs are accurate and helpful

---

## 🎉 Final Verification

### Overall Check
- [ ] All features work as expected
- [ ] No critical bugs
- [ ] UI is polished
- [ ] Error handling works
- [ ] Role-based access works
- [ ] Documentation is complete
- [ ] Ready for demo/presentation
- [ ] Ready for deployment

---

## 📊 Verification Results

**Date:** _______________

**Verified by:** _______________

**Status:**
- [ ] ✅ All checks passed - Ready for production
- [ ] ⚠️ Minor issues found - Needs small fixes
- [ ] ❌ Major issues found - Needs significant work

**Notes:**
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

---

## 🆘 If Something Doesn't Work

### Common Issues & Solutions

**Issue: npm install fails**
- Solution: Delete `node_modules` and `package-lock.json`, run `npm install` again

**Issue: Port 5173 already in use**
- Solution: Kill process on port 5173 or Vite will use next available port

**Issue: Blank page**
- Solution: Check browser console for errors, ensure backend is running

**Issue: Dropdown empty on login**
- Solution: Check backend is running, check CORS, check API URL in `.env`

**Issue: CORS errors**
- Solution: Add `@CrossOrigin(origins = "http://localhost:5173")` to backend controllers

**Issue: Styles not working**
- Solution: Check Tailwind is installed, check `index.css` imports Tailwind

---

## 🎯 Next Steps After Verification

1. [ ] Fix any issues found
2. [ ] Re-run verification
3. [ ] Test with real users
4. [ ] Prepare for demo
5. [ ] Plan deployment
6. [ ] Create Pull Request

---

**Verification Complete! 🎉**

If all checks pass, your frontend is production-ready!
