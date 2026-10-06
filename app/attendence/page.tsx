
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AttendanceRecord = {
  id: number;
  date: string;
  status: string;
  studentId: number;
};

export default function AttendancePage() {
  const router = useRouter();

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/student/attendance"
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load attendance."
          );
        }

        setAttendance(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load attendance."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-600">
            Loading attendance...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#17221c]">
            My Attendance
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

  const presentCount = attendance.filter(
    (record) =>
      record.status.toLowerCase() === "present"
  ).length;

  const absentCount = attendance.filter(
    (record) =>
      record.status.toLowerCase() === "absent"
  ).length;

  const totalClasses = attendance.length;

  const attendancePercentage =
    totalClasses > 0
      ? (presentCount / totalClasses) * 100
      : 0;

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8">

          <button
            onClick={() => router.back()}
            className="mb-3 text-sm font-medium text-[#16a34a] hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-[#17221c]">
            My Attendance
          </h1>

          <p className="mt-2 text-gray-600">
            View your attendance records and attendance percentage.
          </p>

        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

          {/* ATTENDANCE */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Attendance
            </p>

            <p className="mt-2 text-3xl font-bold text-[#16a34a]">
              {attendancePercentage.toFixed(1)}%
            </p>
          </div>

          {/* PRESENT */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Present
            </p>

            <p className="mt-2 text-3xl font-bold text-[#16a34a]">
              {presentCount}
            </p>
          </div>

          {/* ABSENT */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Absent
            </p>

            <p className="mt-2 text-3xl font-bold text-red-500">
              {absentCount}
            </p>
          </div>

          {/* TOTAL */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Classes
            </p>

            <p className="mt-2 text-3xl font-bold text-[#17221c]">
              {totalClasses}
            </p>
          </div>

        </div>

        {/* OVERALL PROGRESS */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="font-semibold text-[#17221c]">
              Overall Attendance
            </h2>

            <span className="font-semibold text-[#16a34a]">
              {attendancePercentage.toFixed(1)}%
            </span>

          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-[#16a34a]"
              style={{
                width: `${Math.min(
                  attendancePercentage,
                  100
                )}%`,
              }}
            />

          </div>

        </div>

        {/* ATTENDANCE RECORDS */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-[#17221c]">
            Attendance Records
          </h2>

          {attendance.length === 0 ? (

            <div className="mt-6 rounded-xl bg-[#f5f7f6] p-8 text-center">

              <div className="text-4xl">
                📅
              </div>

              <p className="mt-3 font-medium text-[#17221c]">
                No attendance records found.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Your attendance will appear here once it is marked.
              </p>

            </div>

          ) : (

            <div className="mt-5 overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b border-gray-200">

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      #
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {attendance.map(
                    (record, index) => {

                      const isPresent =
                        record.status.toLowerCase() ===
                        "present";

                      return (
                        <tr
                          key={record.id}
                          className="border-b border-gray-100"
                        >

                          <td className="px-4 py-4 text-sm text-gray-500">
                            {index + 1}
                          </td>

                          <td className="px-4 py-4 text-sm font-medium text-[#17221c]">
                            {new Date(
                              record.date
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-4 py-4">

                            <span
                              className={
                                isPresent
                                  ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                                  : "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                              }
                            >
                              {record.status}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

