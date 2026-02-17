# ✅ CRMS Frontend Testing Checklist

## 🔐 Authentication Tests

- [ ] Login page loads successfully
- [ ] User dropdown populates from backend
- [ ] Can select and login as different users
- [ ] User data persists in localStorage
- [ ] Logout clears user data
- [ ] Redirects to login when not authenticated
- [ ] Admin redirects to Dashboard after login
- [ ] Student/Staff redirects to Resources after login

## 👥 User Management Tests (ADMIN ONLY)

- [ ] Users page loads all users
- [ ] Can create new user
- [ ] Email validation works
- [ ] Cannot create user with duplicate email (shows error)
- [ ] Can edit existing user
- [ ] Can delete user (with confirmation)
- [ ] Role badges display correctly
- [ ] Table is responsive

## 🏢 Resource Management Tests

### View Resources (ALL ROLES)
- [ ] Resources page loads all resources
- [ ] Resource cards display correctly
- [ ] Available/Unavailable status shows correctly
- [ ] Empty state shows when no resources

### Admin Actions
- [ ] Can create new resource
- [ ] Can edit existing resource
- [ ] Can delete resource (with confirmation)
- [ ] Capacity validation works (min 1)
- [ ] Type dropdown has all options
- [ ] Available checkbox works

### Booking from Resources
- [ ] Book button disabled for unavailable resources
- [ ] Booking modal opens with resource details
- [ ] Date picker works (min: today)
- [ ] Time pickers work
- [ ] Duration calculates correctly
- [ ] Warning shows for Student >1 hour
- [ ] Warning shows for Staff >5 hours
- [ ] Can submit booking
- [ ] Success toast appears

## 📅 Bookings Management Tests (ADMIN)

- [ ] All Bookings page loads
- [ ] Shows all bookings from all users
- [ ] Status badges display correctly (Pending/Approved/Rejected)
- [ ] Approve button only shows for PENDING bookings
- [ ] Reject button only shows for PENDING bookings
- [ ] Approve button works
- [ ] Reject modal opens
- [ ] Reject requires reason (validation)
- [ ] Reject with reason works
- [ ] Delete button works (with confirmation)
- [ ] Table is responsive

## 📋 My Bookings Tests (STUDENT/STAFF)

- [ ] My Bookings page loads
- [ ] Shows only current user's bookings
- [ ] Status badges display correctly
- [ ] Rejection reason shows for rejected bookings
- [ ] Empty state shows when no bookings
- [ ] Cards are responsive

## 📊 Dashboard Tests (ADMIN ONLY)

- [ ] Dashboard loads successfully
- [ ] Total Users stat displays
- [ ] Total Resources stat displays
- [ ] Total Bookings stat displays
- [ ] Total Approved Bookings stat displays
- [ ] Stats update after changes
- [ ] Cards are responsive

## 🚦 Role-Based Access Tests

### STUDENT
- [ ] Cannot access Dashboard
- [ ] Cannot access Users page
- [ ] Cannot access All Bookings page
- [ ] Can access Resources page
- [ ] Can access My Bookings page
- [ ] Cannot see Edit/Delete buttons on resources
- [ ] Can book resources
- [ ] Booking limited to 1 hour (backend validates)

### STAFF
- [ ] Cannot access Dashboard
- [ ] Cannot access Users page
- [ ] Cannot access All Bookings page
- [ ] Can access Resources page
- [ ] Can access My Bookings page
- [ ] Cannot see Edit/Delete buttons on resources
- [ ] Can book resources
- [ ] Booking limited to 5 hours (backend validates)

### ADMIN
- [ ] Can access Dashboard
- [ ] Can access Users page
- [ ] Can access All Bookings page
- [ ] Can access Resources page
- [ ] Can see Edit/Delete buttons on resources
- [ ] Can approve bookings
- [ ] Can reject bookings
- [ ] Can delete bookings
- [ ] No booking time limit

## ⚠️ Error Handling Tests

### 400 - Validation Errors
- [ ] Shows validation error toast
- [ ] Displays specific error message

### 403 - Unauthorized
- [ ] Shows "Not authorized" toast
- [ ] Prevents action

### 404 - Not Found
- [ ] Shows "Resource not found" toast

### 409 - Conflict
- [ ] Shows conflict error (e.g., time slot conflict)
- [ ] Displays specific conflict message

### 500 - Server Error
- [ ] Shows generic server error toast

## 🎨 UI/UX Tests

### Navigation
- [ ] Navbar displays user name and role
- [ ] Logout button works
- [ ] Sidebar shows correct links based on role
- [ ] Active link highlights correctly
- [ ] Navigation is responsive

### Forms
- [ ] All forms have proper validation
- [ ] Required fields show error messages
- [ ] Submit buttons disable during submission
- [ ] Cancel buttons close modals
- [ ] Forms reset after successful submission

### Loading States
- [ ] Loading spinner shows while fetching data
- [ ] Loading spinner shows during form submission
- [ ] No content flicker

### Responsive Design
- [ ] Works on desktop (1920px)
- [ ] Works on laptop (1366px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)
- [ ] Tables scroll horizontally on small screens
- [ ] Cards stack properly on mobile

### Accessibility
- [ ] All buttons have clear labels
- [ ] Forms have proper labels
- [ ] Color contrast is sufficient
- [ ] Can navigate with keyboard
- [ ] Focus states are visible

## 🔄 Integration Tests

### Complete Booking Flow
1. [ ] Login as Student
2. [ ] Go to Resources
3. [ ] Book a resource (1 hour)
4. [ ] Check My Bookings (status: PENDING)
5. [ ] Logout
6. [ ] Login as Admin
7. [ ] Go to All Bookings
8. [ ] Approve the booking
9. [ ] Logout
10. [ ] Login as Student
11. [ ] Check My Bookings (status: APPROVED)

### Complete Rejection Flow
1. [ ] Login as Staff
2. [ ] Book a resource
3. [ ] Logout
4. [ ] Login as Admin
5. [ ] Go to All Bookings
6. [ ] Reject the booking with reason
7. [ ] Logout
8. [ ] Login as Staff
9. [ ] Check My Bookings (status: REJECTED)
10. [ ] Verify rejection reason displays

### Conflict Test
1. [ ] Login as Student
2. [ ] Book resource for specific time slot
3. [ ] Logout
4. [ ] Login as another Student
5. [ ] Try booking same resource, same time
6. [ ] Verify conflict error (409)

### User Management Flow
1. [ ] Login as Admin
2. [ ] Create new user
3. [ ] Logout
4. [ ] Login as new user
5. [ ] Verify access works
6. [ ] Logout
7. [ ] Login as Admin
8. [ ] Delete the user

### Resource Management Flow
1. [ ] Login as Admin
2. [ ] Create new resource
3. [ ] Verify it appears in Resources page
4. [ ] Edit the resource
5. [ ] Verify changes saved
6. [ ] Delete the resource
7. [ ] Verify it's removed

## 🌐 API Integration Tests

- [ ] X-User-Id header sent with all requests
- [ ] Axios interceptor adds header automatically
- [ ] Error interceptor handles all error codes
- [ ] Toast notifications appear for errors
- [ ] API base URL from environment variable
- [ ] All endpoints return expected data

## 🔒 Security Tests

- [ ] Cannot access protected routes without login
- [ ] Cannot access admin routes as Student/Staff
- [ ] Cannot access Student/Staff routes as Admin
- [ ] User data stored securely in localStorage
- [ ] No sensitive data in console logs
- [ ] No API keys exposed in frontend

## 📱 Browser Compatibility

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## 🎯 Performance Tests

- [ ] Initial page load < 3 seconds
- [ ] Navigation between pages is instant
- [ ] No memory leaks
- [ ] Images/assets optimized
- [ ] No unnecessary re-renders

## 📝 Final Checks

- [ ] No console errors
- [ ] No console warnings
- [ ] All features work as expected
- [ ] Code is clean and readable
- [ ] Comments where necessary
- [ ] README is accurate
- [ ] .env file configured
- [ ] .gitignore includes node_modules and .env

---

## 🎉 Testing Complete!

Once all items are checked, your frontend is production-ready!

**Tested by:** _______________  
**Date:** _______________  
**Status:** ⬜ PASS | ⬜ FAIL
