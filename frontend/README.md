# CRMS Frontend - Campus Resource Management System

Production-ready React frontend for the Campus Resource Management System.

## 🚀 Tech Stack

- **React 18** with Vite
- **React Router DOM** for routing
- **Axios** for API calls
- **Context API** for state management
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Zod** for validation
- **React Toastify** for notifications

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios config with interceptors
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Dashboard.jsx         # Admin dashboard
│   │   ├── Users.jsx             # User management (Admin)
│   │   ├── Resources.jsx         # Resource listing & booking
│   │   ├── Bookings.jsx          # All bookings (Admin)
│   │   └── MyBookings.jsx        # User's bookings
│   ├── components/
│   │   ├── Navbar.jsx            # Top navigation
│   │   ├── Sidebar.jsx           # Side navigation
│   │   ├── ProtectedRoute.jsx   # Route protection
│   │   ├── BookingForm.jsx       # Booking creation form
│   │   ├── ResourceForm.jsx      # Resource CRUD form
│   │   └── UserForm.jsx          # User CRUD form
│   ├── layouts/
│   │   └── MainLayout.jsx        # Main app layout
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
├── .env                          # Environment variables
└── package.json
```

## 🔐 Authentication

The backend uses **X-User-Id** header for authorization (no JWT).

- Login page fetches all users from `/users`
- User selects their account
- User data stored in localStorage
- Axios interceptor automatically adds `X-User-Id` header to all requests

## 👥 Role-Based Access Control

### STUDENT
- ✅ View resources
- ✅ Create booking (max 1 hour)
- ✅ View own bookings
- ❌ Cannot approve/reject
- ❌ Cannot delete users/resources

### STAFF
- ✅ Book up to 5 hours
- ✅ View resources
- ✅ View own bookings
- ❌ Cannot approve/reject
- ❌ Cannot delete users

### ADMIN
- ✅ Full access to dashboard
- ✅ Approve/reject bookings
- ✅ Delete bookings
- ✅ Create/update/delete users
- ✅ Create/update/delete resources

## 🛠️ Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

Create `.env` file:

\`\`\`env
VITE_API_BASE_URL=http://localhost:8080
\`\`\`

### 3. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will run on `http://localhost:5173`

### 4. Build for Production

\`\`\`bash
npm run build
\`\`\`

### 5. Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## 🌐 API Integration

All API calls go through `src/api/axios.js` which:

- Sets base URL from environment variable
- Adds `X-User-Id` header automatically
- Handles errors globally with toast notifications
- Maps HTTP status codes to user-friendly messages

### Error Handling

- **400** → Validation error
- **403** → Not authorized
- **404** → Resource not found
- **409** → Conflict (e.g., time slot conflict)
- **500** → Server error

## 📊 Pages Overview

### Login (`/login`)
- Dropdown to select user
- Redirects based on role (Admin → Dashboard, Others → Resources)

### Dashboard (`/dashboard`) - Admin Only
- Total Users
- Total Resources
- Total Bookings
- Total Approved Bookings

### Users (`/users`) - Admin Only
- List all users
- Create new user
- Edit user
- Delete user
- Email validation

### Resources (`/resources`)
- View all resources
- Book available resources
- Admin: Create/Edit/Delete resources

### Bookings (`/bookings`) - Admin Only
- View all bookings
- Approve pending bookings
- Reject bookings (with reason)
- Delete bookings
- Status badges (Pending/Approved/Rejected)

### My Bookings (`/my-bookings`) - Student/Staff
- View own bookings
- See booking status
- View rejection reason if rejected

## 🎨 UI Features

- Responsive design
- Loading spinners
- Empty state messages
- Modal-based forms
- Toast notifications
- Status badges
- Conditional rendering based on roles
- Confirm dialogs for destructive actions

## 🔒 Security Features

- Protected routes
- Role-based UI rendering
- Automatic header injection
- Client-side validation (backend validates again)
- No hardcoded credentials

## 📝 Form Validation

- Email format validation
- Required field validation
- Capacity minimum validation
- Date/time validation
- Duration calculation with warnings

## 🚦 Booking Flow

1. User selects resource
2. Fills booking form (date, start time, end time)
3. Frontend calculates duration
4. Shows warning if exceeds role limit
5. Backend validates and creates booking
6. Admin can approve/reject from Bookings page

## 🎯 Best Practices Implemented

- ✅ Clean folder structure
- ✅ Reusable components
- ✅ Context API for global state
- ✅ Protected routes
- ✅ Error boundary handling
- ✅ Loading states
- ✅ Empty states
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Environment-based configuration

## 🐛 Troubleshooting

### Backend not responding
- Ensure backend is running on `http://localhost:8080`
- Check `.env` file has correct `VITE_API_BASE_URL`

### CORS errors
- Backend must allow `http://localhost:5173` origin
- Check backend CORS configuration

### Login not working
- Ensure backend `/users` endpoint is accessible
- Check browser console for errors

## 📦 Dependencies

```json
{
  "axios": "^1.x",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "react-toastify": "^10.x",
  "tailwindcss": "^3.x"
}
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)
- [React Hook Form](https://react-hook-form.com)

## 👨‍💻 Development Team

Built with ❤️ by Team 22

---

**Note:** This is a production-ready frontend that fully integrates with the Spring Boot backend. All role-based logic, error handling, and API integration are properly implemented.
