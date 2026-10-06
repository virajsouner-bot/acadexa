"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Mark = {
  id: number;
  subject: string;
  marks: number;
  maxMarks: number;
};

export default function StudentMarksPage() {
  const router = useRouter();

  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMarks() {
      try {
        const response = await fetch("/api/student/marks");
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }

          setError(data.error || "Failed to load marks.");
          return;
        }

        setMarks(data);
      } catch (error) {
        console.error(error);
        setError("Something went wrong while loading marks.");
      } finally {
        setLoading(false);
      }
    }

    loadMarks();
  }, [router]);

  const totalMarks = marks.reduce(
    (total, record) => total + record.marks,
    0
  );

  const totalMaximum = marks.reduce(
    (total, record) => total + record.maxMarks,
    0
  );

  const percentage =
    totalMaximum > 0
      ? ((totalMarks / totalMaximum) * 100).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Loading marks...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-8 py-5">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            StudentHub
          </h1>

          <p className="text-sm text-gray-500">
            Student Marks
          </p>
        </div>

        <button
          onClick={() => router.push("/student")}
          className="rounded-lg bg-gray-200 px-5 py-2 font-medium text-gray-700 hover:bg-gray-300"
        >
          Back to Dashboard
        </button>

      </header>

      <div className="p-8">

        {/* Heading */}
        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            My Marks
          </h2>

          <p className="mt-2 text-gray-600">
            View your subject-wise academic performance.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* Subjects */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 text-3xl">
              📚
            </div>

            <p className="text-sm text-gray-500">
              Subjects
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {marks.length}
            </p>

          </div>

          {/* Total Marks */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 text-3xl">
              📝
            </div>

            <p className="text-sm text-gray-500">
              Total Marks
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalMarks} / {totalMaximum}
            </p>

          </div>

          {/* Percentage */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 text-3xl">
              📊
            </div>

            <p className="text-sm text-gray-500">
              Overall Percentage
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {percentage}%
            </p>

          </div>

        </div>

        {/* Marks Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="border-b p-6">

            <h3 className="text-xl font-semibold text-gray-900">
              Subject-wise Marks
            </h3>

          </div>

          {marks.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No marks have been entered yet.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      #
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Subject
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Marks
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Maximum
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Percentage
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {marks.map((record, index) => {

                    const subjectPercentage =
                      record.maxMarks > 0
                        ? (
                            (record.marks /
                              record.maxMarks) *
                            100
                          ).toFixed(1)
                        : "0.0";

                    return (
                      <tr
                        key={record.id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-6 py-4 text-gray-500">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-900">
                          {record.subject}
                        </td>

                        <td className="px-6 py-4 text-center font-medium text-gray-900">
                          {record.marks}
                        </td>

                        <td className="px-6 py-4 text-center text-gray-600">
                          {record.maxMarks}
                        </td>

                        <td className="px-6 py-4 text-center font-semibold text-blue-600">
                          {subjectPercentage}%
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

    </main>
  );
}