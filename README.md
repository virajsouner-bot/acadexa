# 🎓 Acadexa

### Your Complete Academic Ecosystem

Acadexa is a modern **Academic Management System / College Learning Management Platform** designed to bring students, teachers, and administrators together in one centralized platform.

It provides tools for managing students, courses, attendance, marks, assignments, submissions, fees, enrollments, and academic performance.

---

## 🚀 Features

### 👨‍🎓 Student Portal

Students can:

- View their academic dashboard
- View and manage their profile
- View enrolled courses
- View attendance
- View subject-wise marks
- View grades and academic performance
- View fee details and payment status
- View assignments
- Submit assignments
- Upload assignment files
- View assignment grades and teacher feedback
- View academic calendar

---

### 👨‍🏫 Teacher Portal

Teachers can:

- Access a dedicated teacher dashboard
- View student information
- Search students
- Mark student attendance
- Update attendance records
- Enter and update student marks
- Create assignments
- Set assignment deadlines
- Set maximum marks
- View student submissions
- Evaluate assignments
- Give marks and feedback
- Monitor academic performance

---

### 🛠️ Admin Portal

Administrators can manage the academic system and have access to administrative features including:

- Student management
- Teacher management
- Course management
- Attendance management
- Marks management
- Assignment management
- Enrollment management
- Fee management
- Academic records

---

## 📚 Academic Management

Acadexa provides centralized management for:

| Module | Description |
|---|---|
| Students | Student records and academic information |
| Teachers | Faculty information and profiles |
| Courses | Course and subject management |
| Enrollments | Student-course enrollment |
| Attendance | Daily attendance tracking |
| Marks | Subject-wise marks |
| Grades | Academic performance |
| Assignments | Assignment creation and submission |
| Fees | Fee records and payment tracking |
| Calendar | Academic events and deadlines |
| Profiles | Student and teacher information |

---

## 🔐 Role-Based Access

Acadexa uses role-based access control.

### Student

Students can access their own:

- Courses
- Attendance
- Marks
- Grades
- Assignments
- Fees
- Profile

### Teacher

Teachers can:

- Manage attendance
- Manage marks
- Create assignments
- Evaluate submissions
- View students

### Admin

Administrators have broader access to manage the academic system.

---

## 🧑‍💻 Technology Stack

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Backend

- **Next.js API Routes**
- **Prisma ORM**
- **SQLite**
- **JWT Authentication**

### Authentication & Security

- JWT-based authentication
- HTTP-only authentication cookies
- Role-based authorization
- Password hashing with `bcryptjs`

### Database

- SQLite
- Prisma ORM
- Prisma migrations

---

## 📁 Project Structure

```text
acadexa/
│
├── app/
│   ├── api/
│   │   ├── assignments/
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── student/
│   │   └── teacher/
│   │
│   ├── assignments/
│   ├── attendance/
│   ├── courses/
│   ├── dashboard/
│   ├── fees/
│   ├── grades/
│   ├── login/
│   ├── marks/
│   ├── my-courses/
│   ├── profile/
│   ├── register/
│   ├── students/
│   ├── teacher/
│   │   ├── assignments/
│   │   ├── attendance/
│   │   ├── marks/
│   │   └── students/
│   │
│   ├── components/
│   ├── globals.css
│   └── page.tsx
│
├── lib/
│   ├── auth.ts
│   └── prisma.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│   └── uploads/
│
├── prisma.config.ts
├── package.json
├── tsconfig.json
└── README.md
