
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  submission?: Submission | null;
};

type Submission = {
  id: number;
  fileName: string;
  filePath: string | null;
  submittedAt: string;
  status: string;
  marks: number | null;
  feedback: string | null;
};

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.id;
  const assignmentId = params.assignmentId;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAssignment() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/assignments/${assignmentId}`
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load assignment."
        );
      }

      setAssignment(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load assignment."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (assignmentId) {
      loadAssignment();
    }
  }, [assignmentId]);

  async function handleSubmit() {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId: Number(assignmentId),
          fileName: selectedFile.name,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to submit assignment."
        );
      }

      setMessage("Assignment submitted successfully.");
      setSelectedFile(null);

      const fileInput = document.getElementById(
        "assignment-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await loadAssignment();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit assignment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-600">
            Loading assignment...
          </p>
        </div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#17221c]">
            Assignment
          </h1>

          <p className="mt-4 text-red-600">
            {error}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-lg bg-[#16a34a] px-5 py-2.5 font-medium text-white hover:bg-[#15803d]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  const submission = assignment.submission ?? null;

  const isSubmitted = submission !== null;

  const isGraded =
    submission?.marks !== null &&
    submission?.marks !== undefined;

  const dueDate = new Date(assignment.dueDate);

  const isOverdue = dueDate.getTime() < Date.now();

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Back button */}
        <button
          onClick={() =>
            router.push(
              `/courses/${courseId}/assignments`
            )
          }
          className="mb-6 text-sm font-medium text-[#16a34a] hover:underline"
        >
          ← Back to Assignments
        </button>

        {/* Assignment Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div>
              <p className="text-sm font-medium text-[#16a34a]">
                {assignment.course.code}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#17221c]">
                {assignment.title}
              </h1>

              <p className="mt-2 text-gray-500">
                {assignment.course.name}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-gray-500">
                Maximum Marks
              </p>

              <p className="text-2xl font-bold text-[#16a34a]">
                {assignment.maxMarks}
              </p>
            </div>
          </div>

          {/* Due Date */}
          <div className="mt-6 rounded-xl bg-[#f5f7f6] p-4">
            <p className="text-sm text-gray-500">
              Due Date
            </p>

            <p className="mt-1 font-semibold text-[#17221c]">
              {dueDate.toLocaleString()}
            </p>

            {isOverdue && !isSubmitted && (
              <p className="mt-1 text-sm font-medium text-red-600">
                This assignment is overdue.
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-[#17221c]">
              Description
            </h2>

            <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-600">
              {assignment.description ||
                "No description has been provided for this assignment."}
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Submission Section */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#17221c]">
                Your Submission
              </h2>

              <p className="mt-1 text-gray-500">
                Submit your assignment file here.
              </p>
            </div>

            {isSubmitted && (
              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                {submission.status}
              </span>
            )}
          </div>

          {/* Existing submission */}
          {isSubmitted && (
            <div className="mt-6 rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">
                Submitted File
              </p>

              <p className="mt-1 font-semibold text-[#17221c]">
                📄 {submission.fileName}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Submitted on{" "}
                {new Date(
                  submission.submittedAt
                ).toLocaleString()}
              </p>

              {isGraded ? (
                <div className="mt-5 rounded-xl bg-[#f5f7f6] p-5">
                  <p className="text-sm text-gray-500">
                    Your Marks
                  </p>

                  <p className="mt-1 text-3xl font-bold text-[#16a34a]">
                    {submission.marks} /{" "}
                    {assignment.maxMarks}
                  </p>

                  {submission.feedback && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-[#17221c]">
                        Teacher Feedback
                      </p>

                      <p className="mt-1 text-gray-600">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-lg bg-orange-50 p-4 text-sm text-orange-700">
                  Your submission has been received and is
                  waiting for grading.
                </div>
              )}
            </div>
          )}

          {/* Upload */}
          <div className="mt-6">
            <label
              htmlFor="assignment-file"
              className="mb-2 block text-sm font-medium text-[#17221c]"
            >
              {isSubmitted
                ? "Submit a new version"
                : "Choose Assignment File"}
            </label>

            <input
              id="assignment-file"
              type="file"
              accept=".pdf"
              onChange={(event) => {
                const file =
                  event.target.files?.[0] || null;

                setSelectedFile(file);
                setError("");
                setMessage("");
              }}
              className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-600"
            />

            <p className="mt-2 text-xs text-gray-500">
              PDF files are currently supported.
            </p>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !selectedFile}
            className="mt-5 rounded-lg bg-[#16a34a] px-6 py-3 font-medium text-white transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : isSubmitted
              ? "Submit New Version"
              : "Submit Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}

