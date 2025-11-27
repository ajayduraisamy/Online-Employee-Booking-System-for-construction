src/
│
├── api/
│   └── axios.ts
│
├── auth/
│   ├── Login.tsx
│   └── Register.tsx
│
├── components/
│   ├── Sidebar.tsx
│   └── Navbar.tsx   (optional later)
│
├── context/
│   └── AuthContext.tsx
│
├── hooks/
│   └── useAuth.ts
│
├── layouts/
│   └── DashboardLayout.tsx
│
├── router/
│   ├── AppRouter.tsx
│   └── ProtectedRoute.tsx
│
├── pages/
│   ├── Home.tsx
│   │
│   ├── dashboard/
│   │   ├── AdminDashboard.tsx
│   │   ├── ManagerDashboard.tsx
│   │   ├── EmployeeDashboard.tsx
│   │   └── ClientDashboard.tsx
│   │
│   ├── profile/
│   │   └── MyProfile.tsx
│   │
│   ├── admin/
│   │   ├── Users.tsx
│   │   ├── Employees.tsx
│   │   ├── Projects.tsx
│   │   └── Bookings.tsx
│   │
│   ├── manager/
│   │   ├── Bookings.tsx
│   │   ├── Projects.tsx
│   │   ├── Employees.tsx
│   │   └── Assignments.tsx
│   │
│   ├── employee/
│   │   ├── MyTasks.tsx
│   │   └── MyProjects.tsx
│   │
│   └── client/
│       ├── MyBookings.tsx
│       └── CreateBooking.tsx
│
├── App.tsx
└── main.tsx
