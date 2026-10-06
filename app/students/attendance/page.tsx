"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AttendanceRecord = {
  id: number;
  date: string;
  status: "Present" | "Absent";
};

export default function StudentAttendancePage() {
  const router = useRouter();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttendance() {
      try {
        const response = await fetch("/api/student/attendance");
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }

          setError(data.error || "Failed to load attendance.");
          return;
        }

        setRecords(data);
      } catch (error) {
        console.error(error);
        setError("Something went wrong while loading attendance.");
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [router]);

  const presentCount = records.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = records.filter(
    (record) => record.status === "Absent"
  ).length;

  const totalRecords = records.length;

  const percentage =
    totalRecords > 0
      ? ((presentCount / totalRecords) * 100).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Loading attendance...
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
            Student Attendance
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
            My Attendance
          </h2>

          <p className="mt-2 text-gray-600">
            View your attendance records and attendance percentage.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">

          {/* Total */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 text-3xl">
              📅
            </div>

            <p className="text-sm text-gray-500">
              Total Classes
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalRecords}
            </p>

          </div>

          {/* Present */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 text-3xl">
              ✅
            </div>

            <p className="text-sm text-gray-500">
              Present
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {presentCount}
            </p>

          </div>

          {/* Absent */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 text-3xl">
              ❌
            </div>

            <p className="text-sm text-gray-500">
              Absent
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {absentCount}
            </p>

          </div>

          {/* Percentage */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 text-3xl">
              📊
            </div>

            <p className="text-sm text-gray-500">
              Attendance
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {percentage}%
            </p>

          </div>

        </div>

        {/* Attendance Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="border-b p-6">

            <h3 className="text-xl font-semibold text-gray-900">
              Attendance History
            </h3>

          </div>

          {records.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No attendance records found.
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
                      Date
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {records.map((record, index) => (

                    <tr
                      key={record.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900">
                        {record.date}
                      </td>

                      <td className="px-6 py-4 text-center">

                        <span
                          className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                            record.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {record.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}