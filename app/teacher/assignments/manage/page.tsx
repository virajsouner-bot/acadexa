
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  courseId: number;
  course?: {
    id: number;
    name: string;
    code: string;
  };
};

export default function ManageAssignmentsPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [selectedCourse, setSelectedCourse] = useState("");

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD COURSES
  // --------------------------------------------------

  async function loadCourses() {
    try {
      setLoadingCourses(true);
      setError("");

      const response = await fetch("/api/courses");

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load courses."
        );
      }

      setCourses(data);

      if (data.length > 0) {
        setSelectedCourse(String(data[0].id));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load courses."
      );
    } finally {
      setLoadingCourses(false);
    }
  }

  // --------------------------------------------------
  // LOAD ASSIGNMENTS
  // --------------------------------------------------

  async function loadAssignments(courseId: string) {
    if (!courseId) {
      setAssignments([]);
      return;
    }

    try {
      setLoadingAssignments(true);
      setError("");

      const response = await fetch(
        `/api/assignments?courseId=${courseId}`
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load assignments."
        );
      }

      setAssignments(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load assignments."
      );
    } finally {
      setLoadingAssignments(false);
    }
  }

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    loadCourses();
  }, []);

  // --------------------------------------------------
  // COURSE CHANGE
  // --------------------------------------------------

  useEffect(() => {
    if (selectedCourse) {
      loadAssignments(selectedCourse);
    }
  }, [selectedCourse]);

  // --------------------------------------------------
  // DELETE ASSIGNMENT
  // --------------------------------------------------

  async function deleteAssignment(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `/api/assignments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete assignment."
        );
      }

      await loadAssignments(selectedCourse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete assignment."
      );
    }
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-3 text-sm font-medium text-[#16a34a] hover:underline"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-bold text-[#17221c]">
              Manage Assignments
            </h1>

            <p className="mt-2 text-gray-600">
              View, manage and grade assignments created for your courses.
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/teacher/assignments")
            }
            className="rounded-lg bg-[#16a34a] px-5 py-3 font-medium text-white transition hover:bg-[#15803d]"
          >
            + Create Assignment
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* COURSE SELECTOR */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-[#17221c]">
            Select Course
          </label>

          {loadingCourses ? (
            <p className="text-gray-500">
              Loading courses...
            </p>
          ) : courses.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-4 text-gray-600">
              No courses found.
            </div>
          ) : (
            <select
              value={selectedCourse}
              onChange={(event) =>
                setSelectedCourse(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#17221c] outline-none focus:border-[#16a34a] md:max-w-xl"
            >
              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.code} — {course.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ASSIGNMENTS */}
        <div className="mt-6">

          {loadingAssignments ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">
                Loading assignments...
              </p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                📝
              </div>

              <h2 className="mt-4 text-xl font-semibold text-[#17221c]">
                No assignments found
              </h2>

              <p className="mt-2 text-gray-500">
                This course does not have any assignments yet.
              </p>

              <button
                onClick={() =>
                  router.push("/teacher/assignments")
                }
                className="mt-6 rounded-lg bg-[#16a34a] px-5 py-2.5 font-medium text-white hover:bg-[#15803d]"
              >
                Create Assignment
              </button>

            </div>
          ) : (
            <div className="space-y-5">

              {assignments.map((assignment) => {
                const dueDate = new Date(
                  assignment.dueDate
                );

                const isOverdue =
                  dueDate.getTime() < Date.now();

                return (
                  <div
                    key={assignment.id}
                    className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                  >

                    <div className="flex flex-col justify-between gap-5 lg:flex-row">

                      {/* ASSIGNMENT INFORMATION */}
                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-xl font-bold text-[#17221c]">
                            {assignment.title}
                          </h2>

                          {isOverdue ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                              Overdue
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Active
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-gray-600">
                          {assignment.description ||
                            "No description provided."}
                        </p>

                        {/* DETAILS */}
                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                          {/* DUE DATE */}
                          <div className="rounded-lg bg-[#f5f7f6] p-4">

                            <p className="text-xs text-gray-500">
                              Due Date
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#17221c]">
                              {dueDate.toLocaleString()}
                            </p>

                          </div>

                          {/* MARKS */}
                          <div className="rounded-lg bg-[#f5f7f6] p-4">

                            <p className="text-xs text-gray-500">
                              Maximum Marks
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#17221c]">
                              {assignment.maxMarks}
                            </p>

                          </div>

                          {/* COURSE */}
                          <div className="rounded-lg bg-[#f5f7f6] p-4">

                            <p className="text-xs text-gray-500">
                              Course
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#17221c]">
                              {assignment.course?.code ||
                                "Course"}
                            </p>

                          </div>

                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-col gap-3 lg:w-48">

                        {/* VIEW SUBMISSIONS */}
                        <button
                          onClick={() =>
                            router.push(
                              `/teacher/assignments/${assignment.id}/submissions`
                            )
                          }
                          className="rounded-lg bg-[#16a34a] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#15803d]"
                        >
                          View Submissions
                        </button>

                        {/* VIEW ASSIGNMENT */}
                        <button
                          onClick={() =>
                            router.push(
                              `/courses/${assignment.courseId}/assignments/${assignment.id}`
                            )
                          }
                          className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          View Assignment
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            deleteAssignment(
                              assignment.id
                            )
                          }
                          className="rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

