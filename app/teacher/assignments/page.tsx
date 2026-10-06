"use client";

import { useEffect, useState } from "react";

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
  _count?: {
    submissions: number;
  };
};

export default function TeacherAssignmentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [courseId, setCourseId] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load courses and assignments
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [coursesResponse, assignmentsResponse] =
        await Promise.all([
          fetch("/api/courses"),
          fetch("/api/assignments"),
        ]);

      const coursesData = await coursesResponse.json();
      const assignmentsData =
        await assignmentsResponse.json();

      if (!coursesResponse.ok) {
        throw new Error(
          coursesData.error || "Failed to load courses."
        );
      }

      if (!assignmentsResponse.ok) {
        throw new Error(
          assignmentsData.error ||
            "Failed to load assignments."
        );
      }

      setCourses(coursesData.courses || []);
      setAssignments(assignmentsData.assignments || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load data."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAssignment(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("Please enter an assignment title.");
      return;
    }

    if (!courseId) {
      setError("Please select a course.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    try {
      setCreating(true);

      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          maxMarks: Number(maxMarks),
          courseId: Number(courseId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create assignment."
        );
      }

      setMessage(
        "Assignment created successfully."
      );

      // Clear form
      setTitle("");
      setDescription("");
      setDueDate("");
      setMaxMarks("100");
      setCourseId("");

      // Refresh assignment list
      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create assignment."
      );
    } finally {
      setCreating(false);
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
            Assignments
          </h1>

          <p className="text-gray-600 mt-2">
            Create and manage assignments for your courses.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-5 py-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {/* Create Assignment */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#17221c]">
              Create Assignment
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add a new assignment for your students.
            </p>
          </div>

          <form
            onSubmit={handleCreateAssignment}
            className="space-y-6"
          >

            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>

              <select
                value={courseId}
                onChange={(e) =>
                  setCourseId(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">
                  Select a course
                </option>

                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.code} — {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Example: Introduction to Sensors"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
                placeholder="Enter assignment instructions..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none resize-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Due date + marks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>

                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Marks
                </label>

                <input
                  type="number"
                  min="1"
                  value={maxMarks}
                  onChange={(e) =>
                    setMaxMarks(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating
                ? "Creating..."
                : "Create Assignment"}
            </button>

          </form>
        </div>

        {/* Assignment List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#17221c]">
                Existing Assignments
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage assignments created for your courses.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
              {assignments.length} Assignment
              {assignments.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Loading assignments...
            </div>
          ) : assignments.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-5xl mb-4">
                📝
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                No assignments yet
              </h3>

              <p className="text-gray-500 mt-1">
                Create your first assignment using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border border-gray-200 rounded-xl p-5 hover:border-green-300 transition"
                >

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2 mb-2">

                        <h3 className="text-lg font-bold text-[#17221c]">
                          {assignment.title}
                        </h3>

                        <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold">
                          {assignment.course.code}
                        </span>

                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {assignment.course.name}
                      </p>

                      {assignment.description && (
                        <p className="text-sm text-gray-500 mb-4">
                          {assignment.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">

                        <span className="text-gray-600">
                          📅 Due:{" "}
                          <strong>
                            {formatDate(
                              assignment.dueDate
                            )}
                          </strong>
                        </span>

                        <span className="text-gray-600">
                          🎯 Marks:{" "}
                          <strong>
                            {assignment.maxMarks}
                          </strong>
                        </span>

                        <span className="text-gray-600">
                          📤 Submissions:{" "}
                          <strong>
                            {assignment._count
                              ?.submissions ?? 0}
                          </strong>
                        </span>

                      </div>
                    </div>

                    <div>
                      {isOverdue(
                        assignment.dueDate
                      ) ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                          Due
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}