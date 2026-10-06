"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Course = {
  id: number;
  name: string;
  code: string;
  department: string;
  credits: number;
};

type Assignment = {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  maxMarks: number;
  courseId: number;
  createdAt: string;

  _count?: {
    submissions: number;
  };
};

export default function StudentCoursePage() {
  const params = useParams();

  const courseId = params.id;

  const [course, setCourse] =
    useState<Course | null>(null);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!courseId) {
      return;
    }

    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/courses/${courseId}/assignments`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load course."
          );
        }

        setCourse(data.course);

        setAssignments(
          data.assignments || []
        );
      } catch (error) {
        console.error(
          "LOAD COURSE ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm p-8">

            <p className="text-gray-500">
              Loading course...
            </p>

          </div>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm p-8">

            <h1 className="text-2xl font-bold text-red-600">
              Unable to Load Course
            </h1>

            <p className="text-gray-600 mt-2">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d]"
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm p-8">

            <h1 className="text-2xl font-bold">
              Course Not Found
            </h1>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-8">

      <div className="max-w-7xl mx-auto">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <p className="text-sm text-gray-500 mb-2">
              Student / Courses / {course.code}
            </p>

            <h1 className="text-3xl font-bold text-[#17221c]">
              {course.name}
            </h1>

            <p className="text-gray-500 mt-2">
              Course details and assignments
            </p>

          </div>

          <Link
            href="/courses"
            className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            ← Back to Courses
          </Link>

        </div>

        {/* ========================================= */}
        {/* COURSE CARD */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* COURSE ICON */}

            <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center text-4xl">
              📚
            </div>

            {/* COURSE INFO */}

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-2xl font-bold text-[#17221c]">
                  {course.name}
                </h2>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  {course.code}
                </span>

              </div>

              <p className="text-gray-500 mt-2">
                {course.department}
              </p>

            </div>

          </div>

          {/* COURSE DETAILS */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase font-medium">
                Course ID
              </p>

              <p className="text-lg font-bold text-[#17221c] mt-1">
                #{course.id}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase font-medium">
                Department
              </p>

              <p className="text-lg font-bold text-[#17221c] mt-1">
                {course.department}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase font-medium">
                Credits
              </p>

              <p className="text-lg font-bold text-[#17221c] mt-1">
                {course.credits}
              </p>

            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* ASSIGNMENTS HEADER */}
        {/* ========================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

          <div>

            <h2 className="text-2xl font-bold text-[#17221c]">
              Course Assignments
            </h2>

            <p className="text-gray-500 mt-1">
              Assignments posted for this course.
            </p>

          </div>

          <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold">
            {assignments.length} Assignment
            {assignments.length !== 1
              ? "s"
              : ""}
          </div>

        </div>

        {/* ========================================= */}
        {/* NO ASSIGNMENTS */}
        {/* ========================================= */}

        {assignments.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">

            <div className="text-5xl mb-4">
              📝
            </div>

            <h3 className="text-xl font-bold text-[#17221c]">
              No Assignments Yet
            </h3>

            <p className="text-gray-500 mt-2">
              No assignments have been posted for this course.
            </p>

          </div>

        ) : (

          /* ========================================= */
          /* ASSIGNMENT LIST */
          /* ========================================= */

          <div className="space-y-4">

            {assignments.map((assignment) => {

              const dueDate =
                new Date(
                  assignment.dueDate
                );

              const isPast =
                dueDate.getTime() <
                Date.now();

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* ASSIGNMENT INFO */}

                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                        📝
                      </div>

                      <div>

                        <h3 className="text-lg font-bold text-[#17221c]">
                          {assignment.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Assignment ID: #
                          {assignment.id}
                        </p>

                        {assignment.description && (
                          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
                            {assignment.description}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* ASSIGNMENT DETAILS */}

                    <div className="flex flex-wrap items-center gap-3">

                      <div className="px-4 py-2 rounded-xl bg-gray-50">

                        <p className="text-xs text-gray-500">
                          Max Marks
                        </p>

                        <p className="font-semibold">
                          {assignment.maxMarks}
                        </p>

                      </div>

                      <div
                        className={`px-4 py-2 rounded-xl ${
                          isPast
                            ? "bg-red-50"
                            : "bg-yellow-50"
                        }`}
                      >

                        <p className="text-xs text-gray-500">
                          Due Date
                        </p>

                        <p
                          className={`text-sm font-semibold ${
                            isPast
                              ? "text-red-600"
                              : "text-yellow-700"
                          }`}
                        >
                          {dueDate.toLocaleDateString()}
                        </p>

                      </div>

                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="px-5 py-2.5 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] transition"
                      >
                        Open Assignment
                      </Link>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}