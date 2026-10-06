"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Student = {
  id: number;
  fullName: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: string;
};

type Submission = {
  id: number;
  fileName: string;
  filePath: string | null;
  submittedAt: string;
  status: string;
  marks: number | null;
  feedback: string | null;
  student: Student;
};

type Assignment = {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  maxMarks: number;
  courseId: number;
  course: {
    id: number;
    name: string;
    code: string;
  };
};

export default function TeacherAssignmentReviewPage() {
  const params = useParams();

  const assignmentId = params.assignmentId;

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [submissions, setSubmissions] =
    useState<Submission[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [savingId, setSavingId] =
    useState<number | null>(null);

  const [marks, setMarks] = useState<
    Record<number, string>
  >({});

  const [feedback, setFeedback] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    if (!assignmentId) return;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/assignments/${assignmentId}/submissions`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load submissions."
          );
        }

        setAssignment(data.assignment);

        setSubmissions(data.submissions || []);

        // Load existing marks and feedback
        const existingMarks: Record<
          number,
          string
        > = {};

        const existingFeedback: Record<
          number,
          string
        > = {};

        for (const submission of data.submissions || []) {
          existingMarks[submission.id] =
            submission.marks !== null
              ? String(submission.marks)
              : "";

          existingFeedback[submission.id] =
            submission.feedback || "";
        }

        setMarks(existingMarks);
        setFeedback(existingFeedback);
      } catch (error) {
        console.error(
          "LOAD ASSIGNMENT ERROR:",
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

    loadData();
  }, [assignmentId]);

  async function saveGrade(
    submissionId: number
  ) {
    if (!assignment) return;

    const enteredMarks = marks[submissionId];

    if (
      enteredMarks === undefined ||
      enteredMarks.trim() === ""
    ) {
      alert("Please enter marks.");
      return;
    }

    const numericMarks = Number(enteredMarks);

    if (!Number.isFinite(numericMarks)) {
      alert("Please enter a valid number.");
      return;
    }

    if (numericMarks < 0) {
      alert("Marks cannot be negative.");
      return;
    }

    if (numericMarks > assignment.maxMarks) {
      alert(
        `Marks cannot be greater than ${assignment.maxMarks}.`
      );
      return;
    }

    try {
      setSavingId(submissionId);

      const response = await fetch(
        `/api/assignments/${assignmentId}/submissions/${submissionId}/grade`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            marks: numericMarks,

            feedback:
              feedback[submissionId] || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save grade."
        );
      }

      // Update the submission in the UI
      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === submissionId
            ? {
                ...submission,
                marks: data.submission.marks,
                feedback:
                  data.submission.feedback,
                status: data.submission.status,
              }
            : submission
        )
      );

      alert("Grade saved successfully.");
    } catch (error) {
      console.error(
        "SAVE GRADE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save grade."
      );
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-gray-500">
              Loading assignment...
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

          <div className="bg-white rounded-2xl p-8 shadow-sm">

            <h1 className="text-2xl font-bold text-red-600">
              Error
            </h1>

            <p className="text-gray-600 mt-2">
              {error}
            </p>

          </div>

        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl p-8 shadow-sm">

            <h1 className="text-2xl font-bold">
              Assignment not found
            </h1>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <p className="text-sm text-gray-500 mb-2">
              Teacher / Assignments / Review
            </p>

            <h1 className="text-3xl font-bold text-[#17221c]">
              {assignment.title}
            </h1>

            <p className="text-gray-500 mt-2">
              Review and grade student submissions.
            </p>

          </div>

          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            ← Back
          </button>

        </div>

        {/* ASSIGNMENT DETAILS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">

          <h2 className="text-xl font-bold text-[#17221c] mb-5">
            Assignment Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase">
                Course
              </p>

              <p className="font-semibold text-lg mt-2">
                {assignment.course.code}
              </p>

              <p className="text-sm text-gray-500">
                {assignment.course.name}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase">
                Assignment ID
              </p>

              <p className="font-semibold text-lg mt-2">
                #{assignment.id}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase">
                Maximum Marks
              </p>

              <p className="font-semibold text-lg mt-2">
                {assignment.maxMarks}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase">
                Due Date
              </p>

              <p className="font-semibold text-sm mt-2">
                {new Date(
                  assignment.dueDate
                ).toLocaleString()}
              </p>

            </div>

          </div>

          {assignment.description && (
            <div className="mt-6 pt-6 border-t border-gray-100">

              <p className="font-semibold text-gray-700">
                Description
              </p>

              <p className="text-gray-600 mt-2">
                {assignment.description}
              </p>

            </div>
          )}

        </div>

        {/* SUBMISSIONS HEADER */}

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-2xl font-bold text-[#17221c]">
              Student Submissions
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {submissions.length} submission
              {submissions.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

        </div>

        {/* NO SUBMISSIONS */}

        {submissions.length === 0 ? (

          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">

            <div className="text-5xl mb-4">
              📭
            </div>

            <h3 className="text-xl font-bold">
              No submissions yet
            </h3>

            <p className="text-gray-500 mt-2">
              Students have not submitted this assignment.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {submissions.map((submission) => (

              <div
                key={submission.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >

                {/* STUDENT */}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">

                      {submission.student.fullName
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    <div>

                      <h3 className="text-lg font-bold text-[#17221c]">
                        {submission.student.fullName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Roll No:{" "}
                        {submission.student.rollNumber}
                      </p>

                      <p className="text-sm text-gray-500">
                        {submission.student.email}
                      </p>

                    </div>

                  </div>

                  <div>

                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                        submission.status ===
                        "Graded"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {submission.status}
                    </span>

                    <p className="text-xs text-gray-500 mt-2">
                      Submitted:{" "}
                      {new Date(
                        submission.submittedAt
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                {/* FILE */}

                <div className="mt-6 pt-6 border-t border-gray-100">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                      <p className="text-sm font-semibold text-gray-700">
                        Submitted File
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        📎 {submission.fileName}
                      </p>

                    </div>

                    {submission.filePath && (
                      <a
                        href={submission.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] transition text-center"
                      >
                        View / Download
                      </a>
                    )}

                  </div>

                </div>

                {/* GRADING */}

                <div className="mt-6 pt-6 border-t border-gray-100">

                  <h3 className="text-lg font-bold text-[#17221c] mb-5">
                    Grade Submission
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* MARKS */}

                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marks
                      </label>

                      <div className="flex items-center gap-2">

                        <input
                          type="number"
                          min="0"
                          max={assignment.maxMarks}
                          step="0.5"
                          value={
                            marks[submission.id] ?? ""
                          }
                          onChange={(e) =>
                            setMarks((current) => ({
                              ...current,
                              [submission.id]:
                                e.target.value,
                            }))
                          }
                          placeholder="Enter marks"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <span className="text-gray-500 whitespace-nowrap">
                          / {assignment.maxMarks}
                        </span>

                      </div>

                    </div>

                    {/* FEEDBACK */}

                    <div className="md:col-span-2">

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback
                      </label>

                      <textarea
                        rows={3}
                        value={
                          feedback[submission.id] ?? ""
                        }
                        onChange={(e) =>
                          setFeedback((current) => ({
                            ...current,
                            [submission.id]:
                              e.target.value,
                          }))
                        }
                        placeholder="Write feedback for the student..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none resize-none focus:ring-2 focus:ring-green-500"
                      />

                    </div>

                  </div>

                  {/* SAVE BUTTON */}

                  <div className="flex justify-end mt-5">

                    <button
                      onClick={() =>
                        saveGrade(
                          submission.id
                        )
                      }
                      disabled={
                        savingId ===
                        submission.id
                      }
                      className="px-6 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingId ===
                      submission.id
                        ? "Saving..."
                        : submission.marks !==
                            null
                          ? "Update Grade"
                          : "Save Grade"}
                    </button>

                  </div>

                </div>

                {/* EXISTING GRADE */}

                {submission.marks !== null && (
                  <div className="mt-6 pt-6 border-t border-gray-100">

                    <div className="flex items-center gap-3">

                      <span className="text-sm text-gray-500">
                        Current Grade:
                      </span>

                      <span className="text-xl font-bold text-green-600">
                        {submission.marks}
                        {" / "}
                        {assignment.maxMarks}
                      </span>

                    </div>

                  </div>
                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}