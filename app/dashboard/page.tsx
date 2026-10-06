"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  name: string;
  email: string;
  role: string;
};

type Course = {
  id: number;
  name: string;
  code: string;
  credits: number;
};

type Assignment = {
  id: number;
  title: string;
  dueDate: string;
  maxMarks: number;
  course: {
    name: string;
    code: string;
  };
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [userResponse, courseResponse, assignmentResponse] =
        await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/student/courses"),
          fetch("/api/student/assignments"),
        ]);

      const userData = await userResponse.json();
      const courseData = await courseResponse.json();
      const assignmentData = await assignmentResponse.json();

      if (userResponse.ok) {
        setUser(userData.user);
      }

      if (courseResponse.ok) {
        setCourses(courseData.courses || []);
      }

      if (assignmentResponse.ok) {
        setAssignments(assignmentData.assignments || []);
      }
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalCredits = courses.reduce(
    (total, course) => total + course.credits,
    0
  );

  const upcomingAssignments = assignments
    .filter(
      (assignment) =>
        new Date(assignment.dueDate).getTime() >= Date.now()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🎓</div>
          <p className="text-gray-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">

      {/* Welcome */}
      <div className="bg-[#17221c] rounded-3xl p-7 md:p-9 text-white mb-8">

        <p className="text-green-400 font-medium mb-2">
          Student Learning Portal
        </p>

        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
        </h1>

        <p className="text-gray-300 mt-3">
          Manage your courses, assignments, attendance and academic
          progress from one place.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">

          <Link
            href="/my-courses"
            className="px-5 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] transition"
          >
            View My Courses →
          </Link>

          <Link
            href="/assignments"
            className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition"
          >
            View Assignments
          </Link>

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">
                My Courses
              </p>

              <p className="text-3xl font-bold text-[#17221c] mt-2">
                {courses.length}
              </p>
            </div>

            <span className="text-3xl">
              📚
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">
                Total Credits
              </p>

              <p className="text-3xl font-bold text-[#17221c] mt-2">
                {totalCredits}
              </p>
            </div>

            <span className="text-3xl">
              🎓
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">
                Assignments
              </p>

              <p className="text-3xl font-bold text-[#17221c] mt-2">
                {assignments.length}
              </p>
            </div>

            <span className="text-3xl">
              📝
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">
                Upcoming
              </p>

              <p className="text-3xl font-bold text-[#17221c] mt-2">
                {upcomingAssignments.length}
              </p>
            </div>

            <span className="text-3xl">
              ⏰
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Courses */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold text-[#17221c]">
                My Courses
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your currently enrolled courses
              </p>
            </div>

            <Link
              href="/my-courses"
              className="text-sm font-semibold text-green-600 hover:text-green-700"
            >
              View All →
            </Link>

          </div>

          {courses.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">
                📚
              </div>

              <p className="text-gray-500">
                No courses enrolled yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {courses.slice(0, 4).map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="block border border-gray-100 rounded-xl p-5 hover:border-green-300 hover:shadow-sm transition"
                >

                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                        📖
                      </div>

                      <div>
                        <p className="text-xs font-bold text-green-600">
                          {course.code}
                        </p>

                        <h3 className="font-semibold text-[#17221c] mt-1">
                          {course.name}
                        </h3>
                      </div>

                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">
                        {course.credits}
                      </p>

                      <p className="text-xs text-gray-400">
                        Credits
                      </p>
                    </div>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <h2 className="text-xl font-bold text-[#17221c]">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Frequently used academic tools
          </p>

          <div className="space-y-3">

            <Link
              href="/my-courses"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition"
            >
              <span className="text-2xl">
                📚
              </span>

              <div>
                <p className="font-semibold text-gray-800">
                  My Courses
                </p>

                <p className="text-xs text-gray-500">
                  View enrolled courses
                </p>
              </div>
            </Link>

            <Link
              href="/assignments"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition"
            >
              <span className="text-2xl">
                📝
              </span>

              <div>
                <p className="font-semibold text-gray-800">
                  Assignments
                </p>

                <p className="text-xs text-gray-500">
                  Submit your assignments
                </p>
              </div>
            </Link>

            <Link
              href="/attendance"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition"
            >
              <span className="text-2xl">
                📋
              </span>

              <div>
                <p className="font-semibold text-gray-800">
                  Attendance
                </p>

                <p className="text-xs text-gray-500">
                  Check attendance
                </p>
              </div>
            </Link>

            <Link
              href="/marks"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition"
            >
              <span className="text-2xl">
                📊
              </span>

              <div>
                <p className="font-semibold text-gray-800">
                  Marks
                </p>

                <p className="text-xs text-gray-500">
                  View academic performance
                </p>
              </div>
            </Link>

          </div>

        </div>

      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-xl font-bold text-[#17221c]">
              Upcoming Assignments
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Keep track of your upcoming deadlines
            </p>
          </div>

          <Link
            href="/assignments"
            className="text-sm font-semibold text-green-600 hover:text-green-700"
          >
            View All →
          </Link>

        </div>

        {upcomingAssignments.length === 0 ? (
          <div className="text-center py-8">

            <div className="text-4xl mb-3">
              🎉
            </div>

            <p className="font-semibold text-gray-700">
              No upcoming assignments
            </p>

            <p className="text-sm text-gray-500 mt-1">
              You're all caught up!
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {upcomingAssignments.map((assignment) => {

              const dueDate = new Date(
                assignment.dueDate
              );

              return (
                <Link
                  key={assignment.id}
                  href={`/assignments/${assignment.id}`}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100 rounded-xl p-5 hover:border-green-300 transition"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                      📝
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#17221c]">
                        {assignment.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {assignment.course.code} ·{" "}
                        {assignment.course.name}
                      </p>
                    </div>

                  </div>

                  <div className="md:text-right">

                    <p className="text-sm font-semibold text-gray-800">
                      Due{" "}
                      {dueDate.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Max marks: {assignment.maxMarks}
                    </p>

                  </div>

                </Link>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}