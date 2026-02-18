# 🎓 Campus Resource Management System (CRMS)

Enterprise-grade full-stack application for managing campus resources, bookings, and users with JWT authentication and role-based access control.

## � Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+
- PostgreSQL (or use environment variables for your database)

### Backend Setup

1. **Configure Environment Variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. **Run Backend**
   ```bash
   mvn spring-boot:run
   ```
   Backend runs on: `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run Frontend**
   ```bash
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

## 📚 Documentation

- **API Documentation**: http://localhost:8080/swagger-ui/index.html
- **Security Setup**: See `SECURITY_SETUP.md`
- **Backend Details**: See `backend/README.md`
- **Frontend Details**: See `frontend/README.md`

## 🏗️ Architecture

### Backend Stack
- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **API**: RESTful with OpenAPI/Swagger
- **Build Tool**: Maven

### Frontend Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State**: Context API
- **Styling**: Tailwind CSS v3
- **HTTP Client**: Axios

## 🎯 Key Features

### Authentication & Security
- ✅ JWT token-based authentication
- ✅ BCrypt password hashing
- ✅ Role-based access control (STAFF, STUDENT)
- ✅ Rate limiting (3 failed login attempts)
- ✅ Account lockout (15 minutes)
- ✅ Stateless session management

### User Management
- Create, read, update, delete users
- Role assignment (STAFF/STUDENT)
- Status management (ACTIVE/INACTIVE)
- Soft delete with audit trail
- Pagination support

### Resource Management
- Manage campus resources (LAB, CLASSROOM, EVENT_HALL)
- Capacity tracking
- Status management (AVAILABLE, UNAVAILABLE, MAINTENANCE)
- Soft delete with audit trail

### Booking System
- Book resources with date and time slot
- Time slots: MORNING, AFTERNOON, FULL_DAY
- Auto-approval system
- Conflict detection (no double booking)
- Cancel booking (only before booking date)
- View own bookings (STUDENT) or all bookings (STAFF)

### Dashboard
- Real-time statistics
- User counts
- Resource availability
- Booking metrics

## � User Roles

### STAFF
- Full access to user management
- Create, update, delete resources
- View all bookings
- Access dashboard statistics

### STUDENT
- View resources
- Create bookings
- View own bookings
- Cancel own bookings
- Access personal dashboard

## 🔐 Security Features

- **JWT Authentication**: Stateless, scalable authentication
- **Password Security**: BCrypt hashing with salt
- **Rate Limiting**: Protection against brute force attacks
- **Soft Delete**: Data preservation for audit trails
- **Database Indexes**: Optimized query performance
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - Login and get JWT token

### Users
- `POST /users` - Register new user (public)
- `GET /users` - Get all users (STAFF only, paginated)
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user (STAFF only)

### Resources
- `POST /resources` - Create resource (STAFF only)
- `GET /resources` - Get all resources
- `GET /resources/{id}` - Get resource by ID
- `PUT /resources/{id}` - Update resource (STAFF only)
- `DELETE /resources/{id}` - Delete resource (STAFF only)

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - Get all bookings (STAFF only)
- `GET /bookings/{id}` - Get booking by ID
- `GET /bookings/user/{userId}` - Get user bookings
- `DELETE /bookings/{id}` - Cancel booking

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## �️ Tech Stack Details

### Backend Technologies
- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (jjwt 0.11.5)
- Hibernate
- Maven
- Swagger/OpenAPI 3.0

### Frontend Technologies
- React 18
- TypeScript
- Vite
- React Router DOM v6
- Axios
- Tailwind CSS v3
- Lucide React (icons)
- React Toastify

## � Configuration

### Environment Variables

Create `backend/.env` file:
```env
DB_URL=jdbc:postgresql://your-host:5432/your-database
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_strong_secret_key
JWT_EXPIRATION=86400000
```

See `SECURITY_SETUP.md` for detailed configuration instructions.

## 🧪 Testing

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm run test
```

### API Testing
Use Swagger UI at: http://localhost:8080/swagger-ui/index.html

## � Deployment

### Backend Deployment
```bash
cd backend
mvn clean package
java -jar target/crms-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

## � Troubleshooting

### Backend Issues
- **Port 8080 in use**: Change port in `application.properties`
- **Database connection failed**: Check credentials in `.env`
- **JWT errors**: Verify JWT_SECRET is set

### Frontend Issues
- **CORS errors**: Verify backend CORS configuration
- **API not responding**: Check backend is running on port 8080
- **Login fails**: Check credentials and backend logs

## � Project Statistics

- **Backend Endpoints**: 20+
- **Frontend Pages**: 8
- **Frontend Components**: 15+
- **Security Features**: 6
- **Database Tables**: 3 (Users, Resources, Bookings)
- **Lines of Code**: 5000+

## 🎓 Learning Outcomes

This project demonstrates:
1. Enterprise-level Spring Boot application
2. JWT authentication and authorization
3. Role-based access control
4. RESTful API design
5. React with TypeScript
6. State management with Context API
7. Responsive UI with Tailwind CSS
8. Security best practices
9. Database design and optimization
10. Production-ready architecture

## 👨‍💻 Development Team

**Team 22 - Java Spring Boot Project**

## 📝 License

This project is for educational purposes.

## � Security

- Never commit `.env` files
- Use strong passwords and JWT secrets
- See `SECURITY_SETUP.md` for security guidelines
- Review code before pushing to Git

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

For questions or issues:
1. Check `SECURITY_SETUP.md` for setup help
2. Review Swagger API documentation
3. Check browser/server console logs
4. Review backend logs for errors

---

**Production-Ready Enterprise Application** 🚀


