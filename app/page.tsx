"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f7f6] text-[#17221c]">
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          
          {/* BRAND */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#17221c]">
              Acad<span className="text-green-600">exa</span>
            </h1>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 transition hover:text-green-600"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-gray-600 transition hover:text-green-600"
            >
              About
            </a>

            <a
              href="#portal"
              className="text-sm font-medium text-gray-600 transition hover:text-green-600"
            >
              Student Portal
            </a>
          </nav>

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden">
        
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green-100 opacity-60 blur-3xl" />

        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-green-50 opacity-70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2">
          
          {/* LEFT SIDE */}
          <div>
            
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-green-600" />

              <span className="text-sm font-semibold text-green-700">
                Your Complete Academic Ecosystem
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-[#17221c] sm:text-5xl lg:text-6xl">
              Your entire academic life,
              <span className="text-green-600"> in one place.</span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Acadexa is a modern academic management platform designed to
              connect students, teachers and administrators through one simple
              and powerful system.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
              >
                Access Student Portal →
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-green-300 hover:bg-green-50"
              >
                Create Account
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-8">
              
              <div>
                <p className="text-2xl font-bold text-[#17221c]">
                  24/7
                </p>

                <p className="text-sm text-gray-500">
                  Academic Access
                </p>
              </div>

              <div className="h-10 w-px bg-gray-200" />

              <div>
                <p className="text-2xl font-bold text-[#17221c]">
                  3
                </p>

                <p className="text-sm text-gray-500">
                  User Roles
                </p>
              </div>

              <div className="h-10 w-px bg-gray-200" />

              <div>
                <p className="text-2xl font-bold text-[#17221c]">
                  1
                </p>

                <p className="text-sm text-gray-500">
                  Unified Platform
                </p>
              </div>
            </div>
          </div>

          {/* ==================== DASHBOARD PREVIEW ==================== */}
          <div className="relative">
            
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl shadow-gray-300/40">
              
              {/* Browser top bar */}
              <div className="mb-4 flex items-center justify-between rounded-xl bg-[#17221c] px-4 py-3">
                
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <span className="text-xs font-medium text-gray-300">
                  Acadexa Dashboard
                </span>

                <div className="w-12" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                
                {/* PREVIEW SIDEBAR */}
                <div className="row-span-4 rounded-xl bg-[#17221c] p-3">
                  
                  <div className="mb-5">
                    <span className="text-sm font-bold text-white">
                      Acad<span className="text-green-400">exa</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <PreviewNav active text="Dashboard" />
                    <PreviewNav text="Courses" />
                    <PreviewNav text="Assignments" />
                    <PreviewNav text="Attendance" />
                    <PreviewNav text="Marks" />
                    <PreviewNav text="Calendar" />
                  </div>
                </div>

                {/* PREVIEW CONTENT */}
                <div className="col-span-2 space-y-3">
                  
                  {/* Welcome */}
                  <div className="rounded-xl bg-[#f5f7f6] p-4">
                    <p className="text-[10px] font-medium text-green-600">
                      STUDENT PORTAL
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#17221c]">
                      Welcome back, Riya 👋
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500">
                      Manage your academic progress from one place.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <PreviewStat
                      title="Courses"
                      value="6"
                    />

                    <PreviewStat
                      title="Attendance"
                      value="87%"
                    />

                    <PreviewStat
                      title="Assignments"
                      value="8"
                    />
                  </div>

                  {/* Course */}
                  <div className="rounded-xl border border-gray-100 p-3">
                    
                    <div className="flex items-center justify-between">
                      
                      <div>
                        <span className="text-[9px] font-bold text-green-600">
                          MEC101
                        </span>

                        <p className="mt-1 text-xs font-semibold text-gray-800">
                          Introduction to Mechatronics
                        </p>

                        <p className="mt-1 text-[9px] text-gray-400">
                          4 Credits
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                        📚
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full w-[72%] rounded-full bg-green-600" />
                    </div>

                    <p className="mt-1 text-right text-[8px] text-gray-400">
                      72% progress
                    </p>
                  </div>

                  {/* Assignments */}
                  <div className="rounded-xl border border-gray-100 p-3">
                    
                    <p className="text-xs font-bold text-gray-800">
                      Upcoming Assignments
                    </p>

                    <div className="mt-3 space-y-2">
                      
                      <PreviewAssignment
                        title="Sensor Fundamentals"
                        date="10 Oct"
                      />

                      <PreviewAssignment
                        title="Digital Electronics"
                        date="15 Oct"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:block">
              
              <div className="flex items-center gap-3">
                
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                  ✓
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Academic Progress
                  </p>

                  <p className="text-xs text-green-600">
                    Everything organized
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section
        id="features"
        className="border-y border-gray-200 bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          
          <div className="mx-auto max-w-2xl text-center">
            
            <p className="text-sm font-bold uppercase tracking-wider text-green-600">
              Everything you need
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#17221c] md:text-4xl">
              One platform for your academic journey
            </h2>

            <p className="mt-4 text-gray-500">
              Access the tools you need to manage courses, assignments,
              attendance, grades and academic activities.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            
            <FeatureCard
              icon="📚"
              title="Course Management"
              description="View enrolled courses, course details, credits and academic resources."
            />

            <FeatureCard
              icon="📝"
              title="Assignments"
              description="Track deadlines, submit assignments and receive grades and feedback."
            />

            <FeatureCard
              icon="📋"
              title="Attendance"
              description="Keep track of your attendance and monitor your academic participation."
            />

            <FeatureCard
              icon="📊"
              title="Marks & Grades"
              description="View subject-wise marks, percentages and overall academic performance."
            />

            <FeatureCard
              icon="📅"
              title="Academic Calendar"
              description="Stay updated with classes, examinations, assignments and important events."
            />

            <FeatureCard
              icon="📢"
              title="Announcements"
              description="Never miss important updates and announcements from your institution."
            />
          </div>
        </div>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section
        id="about"
        className="bg-[#f5f7f6] py-20"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
          
          {/* LEFT */}
          <div>
            
            <p className="text-sm font-bold uppercase tracking-wider text-green-600">
              Built for modern education
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#17221c] md:text-4xl">
              Simplifying academic management
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Acadexa brings students, teachers and administrators together
              in a single academic ecosystem. Instead of managing information
              across multiple systems, everything can be accessed from one
              platform.
            </p>

            <div className="mt-7 space-y-4">
              <CheckItem text="Centralized academic information" />
              <CheckItem text="Simple and intuitive interface" />
              <CheckItem text="Student, Teacher and Admin roles" />
              <CheckItem text="Secure authentication" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-3xl bg-[#17221c] p-8 text-white shadow-xl">
            
            <p className="text-sm font-semibold text-green-400">
              ACADEXA
            </p>

            <h3 className="mt-4 text-2xl font-bold">
              Your academic workspace.
            </h3>

            <p className="mt-4 leading-7 text-gray-300">
              From your first course enrollment to your final grades, Acadexa
              keeps your academic journey organized, accessible and easy to
              manage.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <DarkStat
                value="Courses"
                label="Learning"
              />

              <DarkStat
                value="Marks"
                label="Performance"
              />

              <DarkStat
                value="Tasks"
                label="Assignments"
              />

              <DarkStat
                value="Events"
                label="Calendar"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section
        id="portal"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          
          <div className="rounded-3xl bg-[#17221c] px-6 py-14 text-center text-white md:px-12">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-2xl">
              🎓
            </div>

            <h2 className="mt-6 text-3xl font-bold md:text-4xl">
              Ready to access your academic portal?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-300">
              Login to access your courses, assignments, attendance, marks
              and all your academic information.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              
              <Link
                href="/login"
                className="rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white transition hover:bg-green-700"
              >
                Login to Acadexa →
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 font-semibold text-white transition hover:bg-white/20"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row md:px-8">
          
          <div>
            <span className="font-bold text-[#17221c]">
              Acad<span className="text-green-600">exa</span>
            </span>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 Acadexa. Academic Management System.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ================================================= */
/* FEATURE CARD */
/* ================================================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">
      
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl transition group-hover:bg-green-100">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-[#17221c]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

/* ================================================= */
/* CHECK ITEM */
/* ================================================= */

function CheckItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
        ✓
      </div>

      <span className="text-sm font-medium text-gray-700">
        {text}
      </span>
    </div>
  );
}

/* ================================================= */
/* DARK STAT */
/* ================================================= */

function DarkStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      
      <p className="font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {label}
      </p>
    </div>
  );
}

/* ================================================= */
/* PREVIEW NAVIGATION */
/* ================================================= */

function PreviewNav({
  text,
  active = false,
}: {
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-2 py-1.5 text-[8px] ${
        active
          ? "bg-green-600 text-white"
          : "text-gray-400"
      }`}
    >
      {text}
    </div>
  );
}

/* ================================================= */
/* PREVIEW STAT */
/* ================================================= */

function PreviewStat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2.5">
      
      <p className="text-[8px] text-gray-400">
        {title}
      </p>

      <p className="mt-1 text-sm font-bold text-[#17221c]">
        {value}
      </p>
    </div>
  );
}

/* ================================================= */
/* PREVIEW ASSIGNMENT */
/* ================================================= */

function PreviewAssignment({
  title,
  date,
}: {
  title: string;
  date: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-2">
      
      <div className="flex items-center gap-2">
        
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100 text-[9px]">
          📝
        </div>

        <p className="text-[8px] font-medium text-gray-700">
          {title}
        </p>
      </div>

      <span className="text-[8px] text-gray-400">
        {date}
      </span>
    </div>
  );
}