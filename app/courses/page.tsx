"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Course = {
  id: number;
  name: string;
  code: string;
  department: string;
  credits: number;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);

      const response = await fetch("/api/courses");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load courses.");
      }

      setCourses(data.courses || []);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  }

  const departments = useMemo(() => {
    const values = courses.map((course) => course.department);
    return ["All", ...Array.from(new Set(values))];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.code.toLowerCase().includes(search.toLowerCase()) ||
        course.department.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        department === "All" ||
        course.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [courses, search, department]);

  const totalCredits = courses.reduce(
    (total, course) => total + course.credits,
    0
  );

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">
              Academic Learning
            </p>

            <h1 className="text-3xl font-bold text-[#17221c]">
              Courses
            </h1>

            <p className="text-gray-500 mt-2">
              Explore your courses, assignments and academic content.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] transition"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Total Courses
          </p>

          <p className="text-3xl font-bold text-[#17221c] mt-2">
            {courses.length}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Available academic courses
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Total Credits
          </p>

          <p className="text-3xl font-bold text-[#17221c] mt-2">
            {totalCredits}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Credits across courses
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Departments
          </p>

          <p className="text-3xl font-bold text-[#17221c] mt-2">
            {departments.length - 1}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Academic departments
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Courses
            </label>

            <input
              type="text"
              placeholder="Search by course name, code or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <div className="text-3xl mb-3">📚</div>

          <p className="text-gray-500">
            Loading courses...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-red-100">
          <div className="text-4xl mb-3">⚠️</div>

          <h2 className="text-lg font-bold text-gray-800">
            Unable to load courses
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={loadCourses}
            className="mt-5 px-5 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Courses */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#17221c]">
                All Courses
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="text-5xl mb-4">
                🔍
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                No courses found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing your search or department filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  {/* Course Header */}
                  <div className="bg-[#17221c] p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold">
                          {course.code}
                        </span>

                        <h3 className="text-xl font-bold text-white mt-4">
                          {course.name}
                        </h3>
                      </div>

                      <div className="text-3xl">
                        📚
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Department
                        </span>

                        <span className="text-sm font-semibold text-gray-800">
                          {course.department}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Credits
                        </span>

                        <span className="text-sm font-semibold text-gray-800">
                          {course.credits}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Course ID
                        </span>

                        <span className="text-sm font-semibold text-gray-800">
                          #{course.id}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 my-5" />

                    <Link
                      href={`/courses/${course.id}`}
                      className="block w-full text-center px-4 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] transition"
                    >
                      Open Course →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}