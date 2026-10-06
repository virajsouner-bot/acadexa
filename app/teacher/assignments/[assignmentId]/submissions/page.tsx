
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Student = {
  id: number;
  fullName: string;
  rollNumber: string;
  email: string;
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
  maxMarks: number;
  dueDate: string;
  courseId: number;
};

export default function TeacherSubmissionsPage() {
  const params = useParams();
  const router = useRouter();

  const assignmentId = params.assignmentId;

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [submissions, setSubmissions] =
    useState<Submission[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [gradingId, setGradingId] =
    useState<number | null>(null);

  const [marks, setMarks] = useState("");

  const [feedback, setFeedback] = useState("");

  const [saving, setSaving] = useState(false);

  async function loadSubmissions() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/teacher/assignments/${assignmentId}/submissions`
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load submissions."
        );
      }

      setAssignment(data.assignment);
      setSubmissions(data.submissions);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load submissions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (assignmentId) {
      loadSubmissions();
    }
  }, [assignmentId]);

  function startGrading(submission: Submission) {
    setGradingId(submission.id);

    setMarks(
      submission.marks !== null
        ? String(submission.marks)
        : ""
    );

    setFeedback(submission.feedback || "");

    setError("");
  }

  function cancelGrading() {
    setGradingId(null);
    setMarks("");
    setFeedback("");
  }

  async function saveGrade(submissionId: number) {
    if (!assignment) return;

    const numericMarks = Number(marks);

    if (marks.trim() === "" || Number.isNaN(numericMarks)) {
      setError("Please enter valid marks.");
      return;
    }

    if (numericMarks < 0) {
      setError("Marks cannot be negative.");
      return;
    }

    if (numericMarks > assignment.maxMarks) {
      setError(
        `Marks cannot be greater than ${assignment.maxMarks}.`
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/teacher/submissions/${submissionId}/grade`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            marks: numericMarks,
            feedback,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save grade."
        );
      }

      cancelGrading();

      await loadSubmissions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save grade."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <p className="text-gray-600">
          Loading submissions...
        </p>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#17221c]">
            Student Submissions
          </h1>

          <p className="mt-4 text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-[#16a34a] hover:underline"
        >
          ← Back
        </button>

        {/* Assignment information */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-[#17221c]">
            {assignment.title}
          </h1>

          <p className="mt-2 text-gray-600">
            Maximum Marks:{" "}
            <strong>{assignment.maxMarks}</strong>
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Due:{" "}
            {new Date(
              assignment.dueDate
            ).toLocaleString()}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Submission count */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Submissions
          </p>

          <p className="mt-1 text-3xl font-bold text-[#16a34a]">
            {submissions.length}
          </p>
        </div>

        {/* No submissions */}
        {submissions.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-4xl">📭</div>

            <h2 className="mt-4 text-xl font-semibold text-[#17221c]">
              No submissions yet
            </h2>

            <p className="mt-2 text-gray-500">
              Students have not submitted this assignment.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">

            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row">

                  <div>
                    <h2 className="text-xl font-bold text-[#17221c]">
                      {submission.student.fullName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Roll No:{" "}
                      {submission.student.rollNumber}
                    </p>

                    <p className="text-sm text-gray-500">
                      {submission.student.email}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500">
                      Status
                    </p>

                    <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      {submission.status}
                    </span>
                  </div>

                </div>

                {/* File */}
                <div className="mt-5 rounded-xl bg-[#f5f7f6] p-4">
                  <p className="text-sm text-gray-500">
                    Submitted File
                  </p>

                  <p className="mt-1 font-medium text-[#17221c]">
                    📄 {submission.fileName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Submitted:{" "}
                    {new Date(
                      submission.submittedAt
                    ).toLocaleString()}
                  </p>
                </div>

                {/* Current grade */}
                {submission.marks !== null && (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm text-green-700">
                      Current Grade
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-700">
                      {submission.marks} /{" "}
                      {assignment.maxMarks}
                    </p>

                    {submission.feedback && (
                      <p className="mt-2 text-sm text-green-700">
                        Feedback:{" "}
                        {submission.feedback}
                      </p>
                    )}
                  </div>
                )}

                {/* Grade button */}
                {gradingId !== submission.id && (
                  <button
                    onClick={() =>
                      startGrading(submission)
                    }
                    className="mt-5 rounded-lg bg-[#16a34a] px-5 py-2.5 font-medium text-white hover:bg-[#15803d]"
                  >
                    {submission.marks !== null
                      ? "Edit Grade"
                      : "Grade Submission"}
                  </button>
                )}

                {/* Grading form */}
                {gradingId === submission.id && (
                  <div className="mt-5 rounded-xl border border-gray-200 p-5">

                    <h3 className="text-lg font-semibold text-[#17221c]">
                      Grade Submission
                    </h3>

                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-[#17221c]">
                        Marks
                      </label>

                      <input
                        type="number"
                        min="0"
                        max={assignment.maxMarks}
                        value={marks}
                        onChange={(e) =>
                          setMarks(e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#16a34a]"
                        placeholder={`0 - ${assignment.maxMarks}`}
                      />
                    </div>

                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-[#17221c]">
                        Feedback
                      </label>

                      <textarea
                        rows={4}
                        value={feedback}
                        onChange={(e) =>
                          setFeedback(e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#16a34a]"
                        placeholder="Write feedback for the student..."
                      />
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() =>
                          saveGrade(submission.id)
                        }
                        disabled={saving}
                        className="rounded-lg bg-[#16a34a] px-5 py-2.5 font-medium text-white hover:bg-[#15803d] disabled:opacity-50"
                      >
                        {saving
                          ? "Saving..."
                          : "Save Grade"}
                      </button>

                      <button
                        onClick={cancelGrading}
                        disabled={saving}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
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

