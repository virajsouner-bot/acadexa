"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Course = {
  id: number;
  name: string;
  code: string;
};

type Assignment = {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  maxMarks: number;
  course: Course;
};

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/student/assignments");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load assignments."
        );
      }

      setAssignments(data.assignments || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function isOverdue(date: string) {
    return new Date(date).getTime() < Date.now();
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#17221c]">
            My Assignments
          </h1>

          <p className="text-gray-600 mt-2">
            View assignments from your enrolled courses.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-gray-500">
              Loading assignments...
            </p>
          </div>
        ) : assignments.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-5">
              📝
            </div>

            <h2 className="text-xl font-bold text-[#17221c]">
              No assignments
            </h2>

            <p className="text-gray-500 mt-2">
              You currently have no assignments from your courses.
            </p>
          </div>
        ) : (
          /* Assignment List */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {assignments.map((assignment) => {
              const overdue = isOverdue(
                assignment.dueDate
              );

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
                >

                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">

                    <div className="flex items-center justify-between gap-3 mb-4">

                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                        {assignment.course.code}
                      </span>

                      {overdue ? (
                        <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                          Overdue
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                          Active
                        </span>
                      )}

                    </div>

                    <h2 className="text-xl font-bold text-[#17221c]">
                      {assignment.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                      {assignment.course.name}
                    </p>

                  </div>

                  {/* Card Body */}
                  <div className="p-6">

                    {assignment.description && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-5">
                        {assignment.description}
                      </p>
                    )}

                    <div className="space-y-3 text-sm">

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Due Date
                        </span>

                        <span className="font-medium text-[#17221c]">
                          {formatDate(
                            assignment.dueDate
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Maximum Marks
                        </span>

                        <span className="font-medium text-[#17221c]">
                          {assignment.maxMarks}
                        </span>
                      </div>

                    </div>

                    {/* Open Button */}
                    <Link
                      href={`/assignments/${assignment.id}`}
                      className="block text-center mt-6 w-full px-4 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] transition"
                    >
                      View Assignment
                    </Link>

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