"use client";

import { useEffect, useState } from "react";

type Mark = {
  id: number;
  subject: string;
  marks: number;
  maxMarks: number;
};

function getGrade(percentage: number) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

function getGradePoint(percentage: number) {
  if (percentage >= 90) return 10;
  if (percentage >= 80) return 9;
  if (percentage >= 70) return 8;
  if (percentage >= 60) return 7;
  if (percentage >= 50) return 6;
  if (percentage >= 40) return 5;
  return 0;
}

export default function GradesPage() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGrades();
  }, []);

  async function loadGrades() {
    try {
      const response = await fetch("/api/student/marks");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load grades."
        );
      }

      setMarks(data.marks || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load grades."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalMarks = marks.reduce(
    (sum, mark) => sum + mark.marks,
    0
  );

  const totalMaxMarks = marks.reduce(
    (sum, mark) => sum + mark.maxMarks,
    0
  );

  const overallPercentage =
    totalMaxMarks > 0
      ? (totalMarks / totalMaxMarks) * 100
      : 0;

  const averageGradePoint =
    marks.length > 0
      ? marks.reduce((sum, mark) => {
          const percentage =
            (mark.marks / mark.maxMarks) * 100;

          return sum + getGradePoint(percentage);
        }, 0) / marks.length
      : 0;

  const cgpa = averageGradePoint.toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">
            🎓
          </div>

          <p className="text-gray-500">
            Loading grades...
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
          Academic Performance
        </p>

        <h1 className="text-3xl font-bold text-[#17221c] mt-1">
          Grades
        </h1>

        <p className="text-gray-500 mt-2">
          View your grades and overall academic performance.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="bg-white border border-red-100 rounded-2xl p-6 mb-6">
          <p className="text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Summary */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Overall Percentage
          </p>

          <p className="text-4xl font-bold text-green-600 mt-2">
            {overallPercentage.toFixed(1)}%
          </p>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            CGPA
          </p>

          <p className="text-4xl font-bold text-[#17221c] mt-2">
            {cgpa}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Based on current marks
          </p>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Overall Grade
          </p>

          <p className="text-4xl font-bold text-[#17221c] mt-2">
            {getGrade(overallPercentage)}
          </p>

        </div>

      </div>

      {/* Performance */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

        <div className="flex justify-between items-center mb-3">

          <div>
            <h2 className="font-bold text-[#17221c]">
              Overall Performance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {totalMarks} / {totalMaxMarks} marks
            </p>
          </div>

          <span className="font-bold text-green-600">
            {overallPercentage.toFixed(1)}%
          </span>

        </div>

        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">

          <div
            className="h-full bg-[#16a34a] rounded-full"
            style={{
              width: `${Math.min(
                overallPercentage,
                100
              )}%`,
            }}
          />

        </div>

      </div>

      {/* Subject Grades */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-6 border-b border-gray-100">

          <h2 className="text-xl font-bold text-[#17221c]">
            Subject Grades
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Detailed subject-wise grade information
          </p>

        </div>

        {marks.length === 0 ? (
          <div className="p-12 text-center">

            <div className="text-5xl mb-4">
              🎓
            </div>

            <h3 className="font-bold text-gray-800">
              No grades available
            </h3>

            <p className="text-gray-500 mt-2">
              Grades will appear here once marks are entered.
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

                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                    Grade Point
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {marks.map((mark) => {

                  const percentage =
                    mark.maxMarks > 0
                      ? (mark.marks / mark.maxMarks) * 100
                      : 0;

                  const grade =
                    getGrade(percentage);

                  const gradePoint =
                    getGradePoint(percentage);

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

                        <span className="font-bold">
                          {mark.marks}
                        </span>

                        <span className="text-gray-400">
                          {" "}
                          / {mark.maxMarks}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-center">

                        <span className="font-semibold">
                          {percentage.toFixed(1)}%
                        </span>

                      </td>

                      <td className="px-6 py-5 text-center">

                        <span className="inline-flex min-w-12 justify-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                          {grade}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-center">

                        <span className="font-bold text-[#17221c]">
                          {gradePoint}
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