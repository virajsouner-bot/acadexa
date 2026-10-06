"use client";

import { useEffect, useState } from "react";

type Mark = {
  id: number;
  subject: string;
  marks: number;
  maxMarks: number;
};

type Summary = {
  subjects: number;
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
};

export default function MarksPage() {
  const [marks, setMarks] = useState<Mark[]>([]);

  const [summary, setSummary] = useState<Summary>({
    subjects: 0,
    totalMarks: 0,
    totalMaxMarks: 0,
    percentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMarks();
  }, []);

  async function loadMarks() {
    try {
      const response = await fetch(
        "/api/student/marks"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load marks."
        );
      }

      setMarks(data.marks || []);

      setSummary(
        data.summary || {
          subjects: 0,
          totalMarks: 0,
          totalMaxMarks: 0,
          percentage: 0,
        }
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load marks."
      );
    } finally {
      setLoading(false);
    }
  }

  function getPercentage(
    marksObtained: number,
    maxMarks: number
  ) {
    if (maxMarks === 0) return 0;

    return Math.round(
      (marksObtained / maxMarks) * 100
    );
  }

  function getGrade(percentage: number) {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">
            📊
          </div>

          <p className="text-gray-500">
            Loading marks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-green-600">
          Academic Records
        </p>

        <h1 className="text-3xl font-bold text-[#17221c] mt-1">
          My Marks
        </h1>

        <p className="text-gray-500 mt-2">
          View your subject-wise marks and academic performance.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-white rounded-2xl border border-red-100 p-6 mb-6">
          <p className="text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">
            Overall Percentage
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {summary.percentage}%
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Marks
          </p>

          <p className="text-3xl font-bold text-[#17221c] mt-2">
            {summary.totalMarks}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            out of {summary.totalMaxMarks}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">
            Subjects
          </p>

          <p className="text-3xl font-bold text-[#17221c] mt-2">
            {summary.subjects}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">
            Overall Grade
          </p>

          <p className="text-3xl font-bold text-[#17221c] mt-2">
            {getGrade(summary.percentage)}
          </p>
        </div>

      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-[#17221c]">
            Overall Performance
          </h2>

          <span className="font-bold text-green-600">
            {summary.percentage}%
          </span>
        </div>

        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#16a34a] rounded-full"
            style={{
              width: `${Math.min(
                summary.percentage,
                100
              )}%`,
            }}
          />
        </div>

      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#17221c]">
            Subject-wise Performance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your marks for each subject
          </p>
        </div>

        {marks.length === 0 ? (
          <div className="p-12 text-center">

            <div className="text-5xl mb-4">
              📊
            </div>

            <h3 className="font-bold text-gray-800">
              No marks available
            </h3>

            <p className="text-gray-500 mt-2">
              Your marks will appear here once they are entered.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Subject
                  </th>

                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                    Marks
                  </th>

                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                    Percentage
                  </th>

                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                    Grade
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {marks.map((mark) => {
                  const percentage = getPercentage(
                    mark.marks,
                    mark.maxMarks
                  );

                  return (
                    <tr
                      key={mark.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-800">
                          {mark.subject}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span className="font-bold text-gray-800">
                          {mark.marks}
                        </span>

                        <span className="text-gray-400">
                          {" "}
                          / {mark.maxMarks}
                        </span>
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#16a34a]"
                              style={{
                                width: `${Math.min(
                                  percentage,
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="text-sm font-semibold">
                            {percentage}%
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                          {getGrade(percentage)}
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}