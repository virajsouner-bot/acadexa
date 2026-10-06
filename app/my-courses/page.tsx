"use client";

import { useEffect, useState } from "react";

type Course = {
  id: number;
  name: string;
  code: string;
  department: string;
  credits: number;
  assignmentCount: number;
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const response = await fetch("/api/student/courses");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load courses."
        );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
        <p className="text-gray-500">
          Loading your courses...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="bg-white rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-red-500">
            Error
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">

      <div className="mb-8">
        <p className="text-sm font-semibold text-green-600">
          Student Learning Portal
        </p>

        <h1 className="text-3xl font-bold text-[#17221c] mt-1">
          My Courses
        </h1>

        <p className="text-gray-500 mt-2">
          Courses you are currently enrolled in.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">
            📚
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            No courses found
          </h2>

          <p className="text-gray-500 mt-2">
            You are not currently enrolled in any courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            >

              <div className="bg-[#17221c] p-6">
                <span className="text-green-400 text-sm font-bold">
                  {course.code}
                </span>

                <h2 className="text-xl font-bold text-white mt-3">
                  {course.name}
                </h2>
              </div>

              <div className="p-6">

                <p className="text-sm text-gray-500">
                  Department
                </p>

                <p className="font-semibold text-gray-800 mt-1">
                  {course.department}
                </p>

                <div className="flex justify-between mt-5">
                  <div>
                    <p className="text-xs text-gray-500">
                      Credits
                    </p>

                    <p className="font-bold">
                      {course.credits}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Assignments
                    </p>

                    <p className="font-bold">
                      {course.assignmentCount}
                    </p>
                  </div>
                </div>

                <a
                  href={`/courses/${course.id}`}
                  className="block text-center mt-6 px-4 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d]"
                >
                  Open Course →
                </a>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}