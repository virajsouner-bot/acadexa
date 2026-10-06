"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Submission = {
  id: number;
  fileName: string;
  filePath: string | null;
  submittedAt: string;
  status: string;
  marks: number | null;
  feedback: string | null;
};

type Assignment = {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  maxMarks: number;
  courseId: number;
  createdAt: string;

  course: {
    id: number;
    name: string;
    code: string;
    department: string;
    credits: number;
  };

  submission: Submission | null;
};

export default function StudentAssignmentPage() {
  const params = useParams();

  const assignmentId = params.id;

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  async function loadAssignment() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/student/assignments/${assignmentId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load assignment."
        );
      }

      setAssignment(data.assignment);
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

  useEffect(() => {
    if (!assignmentId) return;

    loadAssignment();
  }, [assignmentId]);

  async function uploadAssignment() {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    if (!assignment) {
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      alert("File size cannot be greater than 10 MB.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `/api/student/assignments/${assignment.id}/submit/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to submit assignment."
        );
      }

      alert(
        "Assignment submitted successfully!"
      );

      setSelectedFile(null);

      const fileInput =
        document.getElementById(
          "assignment-file"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await loadAssignment();
    } catch (error) {
      console.error(
        "UPLOAD ASSIGNMENT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to submit assignment."
      );
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">

        <div className="max-w-5xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm p-8">

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

        <div className="max-w-5xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm p-8">

            <h1 className="text-2xl font-bold text-red-600">
              Unable to Load Assignment
            </h1>

            <p className="text-gray-600 mt-2">
              {error}
            </p>

            <button
              onClick={loadAssignment}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#16a34a] text-white font-medium hover:bg-[#15803d]"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">

        <div className="max-w-5xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm p-8">

            <h1 className="text-2xl font-bold">
              Assignment Not Found
            </h1>

          </div>

        </div>

      </div>
    );
  }

  const submission = assignment.submission;

  const isGraded =
    submission?.marks !== null &&
    submission?.marks !== undefined;

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-8">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <p className="text-sm text-gray-500 mb-2">
              Student / Assignments
            </p>

            <h1 className="text-3xl font-bold text-[#17221c]">
              {assignment.title}
            </h1>

            <p className="text-gray-500 mt-2">
              View assignment details and submit your work.
            </p>

          </div>

          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
          >
            ← Back
          </button>

        </div>

        {/* ASSIGNMENT DETAILS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

          <h2 className="text-xl font-bold text-[#17221c] mb-5">
            Assignment Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase">
                Course
              </p>

              <p className="font-bold text-lg mt-2">
                {assignment.course.code}
              </p>

              <p className="text-sm text-gray-500">
                {assignment.course.name}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase">
                Course ID
              </p>

              <p className="font-bold text-lg mt-2">
                #{assignment.courseId}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase">
                Maximum Marks
              </p>

              <p className="font-bold text-lg mt-2">
                {assignment.maxMarks}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase">
                Due Date
              </p>

              <p className="font-bold text-sm mt-2">
                {new Date(
                  assignment.dueDate
                ).toLocaleString()}
              </p>

            </div>

          </div>

          {/* DESCRIPTION */}

          {assignment.description && (
            <div className="mt-6 pt-6 border-t border-gray-100">

              <p className="font-semibold text-gray-700">
                Description
              </p>

              <p className="text-gray-600 mt-2 leading-relaxed">
                {assignment.description}
              </p>

            </div>
          )}

        </div>

        {/* SUBMISSION STATUS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h2 className="text-xl font-bold text-[#17221c]">
                Your Submission
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Upload your assignment file below.
              </p>

            </div>

            {submission && (
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  submission.status === "Graded"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {submission.status}
              </span>
            )}

          </div>

          {/* EXISTING FILE */}

          {submission && (
            <div className="mt-6 bg-gray-50 rounded-xl p-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="text-sm font-semibold text-gray-700">
                    Submitted File
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    📎 {submission.fileName}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Submitted on{" "}
                    {new Date(
                      submission.submittedAt
                    ).toLocaleString()}
                  </p>

                </div>

                {submission.filePath && (
                  <a
                    href={submission.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] text-center"
                  >
                    View File
                  </a>
                )}

              </div>

            </div>
          )}

          {/* FILE UPLOAD */}

          <div className="mt-6">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {submission
                ? "Upload New File"
                : "Choose Assignment File"}
            </label>

            <input
              id="assignment-file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
              onChange={(event) => {
                const file =
                  event.target.files?.[0] ||
                  null;

                setSelectedFile(file);
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm"
            />

            <p className="text-xs text-gray-400 mt-2">
              Maximum file size: 10 MB
            </p>

            {selectedFile && (
              <div className="mt-3 bg-green-50 text-green-700 rounded-xl p-3 text-sm">
                Selected:{" "}
                <strong>
                  {selectedFile.name}
                </strong>
              </div>
            )}

            <button
              onClick={uploadAssignment}
              disabled={uploading}
              className="mt-5 px-6 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? "Uploading..."
                : submission
                  ? "Resubmit Assignment"
                  : "Submit Assignment"}
            </button>

          </div>

        </div>

        {/* ========================================= */}
        {/* GRADE SECTION */}
        {/* ========================================= */}

        {submission && (

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold text-[#17221c]">
                  Grade & Feedback
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your teacher's evaluation will appear here.
                </p>

              </div>

              {isGraded && (
                <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  Graded
                </span>
              )}

            </div>

            {!isGraded ? (

              <div className="bg-gray-50 rounded-xl p-6 text-center">

                <div className="text-4xl mb-3">
                  ⏳
                </div>

                <h3 className="font-bold text-lg text-[#17221c]">
                  Waiting for Evaluation
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  Your teacher has not graded this assignment yet.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {/* MARKS */}

                <div className="bg-green-50 rounded-2xl p-6">

                  <p className="text-sm text-gray-500">
                    Marks Obtained
                  </p>

                  <div className="flex items-end gap-2 mt-1">

                    <span className="text-4xl font-bold text-green-700">
                      {submission.marks}
                    </span>

                    <span className="text-gray-500 mb-1">
                      / {assignment.maxMarks}
                    </span>

                  </div>

                  <div className="mt-4">

                    <div className="w-full h-3 bg-white rounded-full overflow-hidden">

                      <div
                        className="h-full bg-[#16a34a] rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              ((submission.marks || 0) /
                                assignment.maxMarks) *
                                100
                            )
                          )}%`,
                        }}
                      />

                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {(
                        ((submission.marks || 0) /
                          assignment.maxMarks) *
                        100
                      ).toFixed(1)}
                      %
                    </p>

                  </div>

                </div>

                {/* FEEDBACK */}

                <div>

                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Teacher Feedback
                  </p>

                  {submission.feedback ? (

                    <div className="bg-gray-50 rounded-xl p-5">

                      <p className="text-gray-600 leading-relaxed">
                        {submission.feedback}
                      </p>

                    </div>

                  ) : (

                    <div className="bg-gray-50 rounded-xl p-5">

                      <p className="text-gray-400">
                        No feedback was provided.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}