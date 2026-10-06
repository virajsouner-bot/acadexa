"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Assignment = {
  id: number;
  title: string;
  description: string;
  module: string;
  dueDate: string;
  maxMarks: number;
  status: "Upcoming" | "Submitted" | "Overdue";
  submission: "Not Submitted" | "Submitted" | "Late";
};

const assignments: Assignment[] = [
  {
    id: 1,
    title: "Problem Set 1",
    description:
      "Solve the given numerical problems from the first module.",
    module: "Module 1",
    dueDate: "October 10, 2026",
    maxMarks: 20,
    status: "Upcoming",
    submission: "Not Submitted",
  },
  {
    id: 2,
    title: "Digital Logic Assignment",
    description:
      "Design and simplify the given Boolean expressions using logic gates.",
    module: "Module 2",
    dueDate: "October 14, 2026",
    maxMarks: 25,
    status: "Upcoming",
    submission: "Not Submitted",
  },
  {
    id: 3,
    title: "Mid-Semester Practice Sheet",
    description:
      "Complete the practice questions provided for the mid-semester examination.",
    module: "Module 3",
    dueDate: "September 28, 2026",
    maxMarks: 30,
    status: "Submitted",
    submission: "Submitted",
  },
  {
    id: 4,
    title: "Introduction to Mechanics",
    description:
      "Answer the questions based on the concepts covered in class.",
    module: "Module 1",
    dueDate: "September 20, 2026",
    maxMarks: 20,
    status: "Overdue",
    submission: "Not Submitted",
  },
];

export default function AssignmentsPage() {
  const router = useRouter();
  const params = useParams();

  const courseId = params.id as string;

  const [activeFilter, setActiveFilter] = useState("All");

  const filteredAssignments = useMemo(() => {
    if (activeFilter === "All") {
      return assignments;
    }

    return assignments.filter(
      (assignment) => assignment.status === activeFilter
    );
  }, [activeFilter]);

  return (
    <main className="min-h-screen bg-[#f5f7f6]">
      {/* Top Bar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                router.push(`/courses/${courseId}`)
              }
              className="rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              ←
            </button>

            <div>
              <h1 className="text-xl font-bold text-green-600">
                StudentHub
              </h1>

              <p className="text-xs text-gray-500">
                Course Assignments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 font-bold text-white">
              R
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                Riya
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => router.push("/courses")}
            className="hover:text-green-600"
          >
            Courses
          </button>

          <span>›</span>

          <button
            onClick={() =>
              router.push(`/courses/${courseId}`)
            }
            className="hover:text-green-600"
          >
            Course
          </button>

          <span>›</span>

          <span className="font-medium text-gray-800">
            Assignments
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-8 rounded-2xl bg-[#17221c] p-7 text-white">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-green-400">
                Course Activities
              </p>

              <h2 className="text-3xl font-bold">
                Assignments
              </h2>

              <p className="mt-2 max-w-2xl text-gray-300">
                View your assignments, deadlines, submission
                status and marks.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-5 py-4">
              <p className="text-sm text-gray-300">
                Total Assignments
              </p>

              <p className="mt-1 text-3xl font-bold">
                {assignments.length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {["All", "Upcoming", "Submitted", "Overdue"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 shadow-sm hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* Assignment List */}
        <div className="space-y-5">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={() =>
                alert(
                  `Opening "${assignment.title}"...`
                )
              }
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">📝</div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No assignments found
            </h3>

            <p className="mt-2 text-gray-500">
              There are no assignments in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function AssignmentCard({
  assignment,
  onClick,
}: {
  assignment: Assignment;
  onClick: () => void;
}) {
  const statusStyles = {
    Upcoming: "bg-green-100 text-green-700",
    Submitted: "bg-gray-100 text-gray-700",
    Overdue: "bg-red-100 text-red-700",
  };

  const submissionStyles = {
    "Not Submitted": "text-orange-600",
    Submitted: "text-green-600",
    Late: "text-red-600",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Assignment Info */}
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl">
            📝
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">
                {assignment.title}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[assignment.status]
                }`}
              >
                {assignment.status}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              {assignment.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-5 text-sm">
              <span className="text-gray-500">
                📚 {assignment.module}
              </span>

              <span className="text-gray-500">
                📅 Due {assignment.dueDate}
              </span>

              <span className="font-medium text-gray-700">
                🎯 {assignment.maxMarks} marks
              </span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex min-w-[180px] flex-col items-start gap-3 lg:items-end">
          <div className="text-sm">
            <span className="text-gray-500">
              Submission:
            </span>{" "}
            <span
              className={`font-semibold ${
                submissionStyles[assignment.submission]
              }`}
            >
              {assignment.submission}
            </span>
          </div>

          <button
            onClick={onClick}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            {assignment.submission === "Not Submitted"
              ? "View & Submit"
              : "View Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}