# 🚀 CRMS Frontend - Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- Backend running on `http://localhost:8080`

## 🏃 Quick Start (3 Steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open Browser

Navigate to: `http://localhost:5173`

## 🎯 First Login

1. On the login page, select any user from the dropdown
2. Click "Login"
3. You'll be redirected based on your role:
   - **Admin** → Dashboard
   - **Student/Staff** → Resources

## 🧪 Test Different Roles

### Test as ADMIN
- Access Dashboard (view stats)
- Manage Users (create/edit/delete)
- Manage Resources (create/edit/delete)
- View All Bookings
- Approve/Reject bookings

### Test as STUDENT
- View Resources
- Create Booking (max 1 hour)
- View My Bookings
- See booking status

### Test as STAFF
- View Resources
- Create Booking (max 5 hours)
- View My Bookings

## 📋 Common Tasks

### Create a User (Admin)
1. Go to Users page
2. Click "+ Add User"
3. Fill form and submit

### Create a Resource (Admin)
1. Go to Resources page
2. Click "+ Add Resource"
3. Fill form and submit

### Book a Resource
1. Go to Resources page
2. Click "Book" on any available resource
3. Select date and time
4. Submit booking

### Approve a Booking (Admin)
1. Go to All Bookings page
2. Find pending booking
3. Click "Approve"

### Reject a Booking (Admin)
1. Go to All Bookings page
2. Find pending booking
3. Click "Reject"
4. Enter rejection reason
5. Submit

## 🔧 Configuration

The `.env` file is already configured:

```env
VITE_API_BASE_URL=http://localhost:8080
```

If your backend runs on a different port, update this file.

## 🐛 Troubleshooting

### "Failed to load users" on login
- ✅ Ensure backend is running
- ✅ Check backend is on port 8080
- ✅ Verify backend `/users` endpoint works

### CORS errors
- ✅ Backend must allow `http://localhost:5173` origin
- ✅ Check backend CORS configuration

### Blank page
- ✅ Check browser console for errors
- ✅ Ensure all dependencies installed (`npm install`)
- ✅ Try clearing browser cache

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 🎨 Features Checklist

- ✅ Role-based authentication
- ✅ Protected routes
- ✅ Dashboard with stats (Admin)
- ✅ User management (Admin)
- ✅ Resource management (Admin)
- ✅ Booking creation with validation
- ✅ Booking approval/rejection (Admin)
- ✅ My Bookings view
- ✅ Toast notifications
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

## 🎯 Next Steps

1. Test all user roles
2. Try creating bookings with different durations
3. Test approval/rejection flow
4. Verify error handling (try booking same slot twice)
5. Check responsive design on mobile

## 📞 Need Help?

Check the main `README.md` for detailed documentation.

---

**Happy Coding! 🚀**
