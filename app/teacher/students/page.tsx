"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  fullName: string;
  email: string;
  rollNumber: string;
  course: string;
  department: string;
  semester: string;
  phone: string | null;
};

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const response = await fetch("/api/teacher/students");

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load students.");
        return;
      }

      setStudents(data.students || []);
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = students.filter((student) => {
    const text = search.toLowerCase();

    return (
      student.fullName.toLowerCase().includes(text) ||
      student.email.toLowerCase().includes(text) ||
      student.rollNumber.toLowerCase().includes(text) ||
      student.course.toLowerCase().includes(text)
    );
  });

  return (
    <main className="min-h-screen bg-[#f5f7f6] p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-green-600">
          TEACHER PORTAL
        </p>

        <h1 className="mt-1 text-3xl font-bold text-[#17221c]">
          Students
        </h1>

        <p className="mt-2 text-gray-500">
          View and manage students associated with your courses.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="mt-2 text-3xl font-bold text-[#17221c]">
            {students.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Departments</p>
          <p className="mt-2 text-3xl font-bold text-[#17221c]">
            {new Set(students.map((student) => student.department)).size}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Search Results</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {filteredStudents.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <input
          type="text"
          placeholder="Search by name, email, roll number or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading students...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-lg font-semibold text-[#17221c]">
              No students found
            </p>

            <p className="mt-2 text-gray-500">
              Try changing your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Roll Number
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Course
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Semester
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                          {student.fullName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-[#17221c]">
                            {student.fullName}
                          </p>

                          <p className="text-sm text-gray-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 font-medium text-[#17221c]">
                      {student.rollNumber}
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {student.course}
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {student.department}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                        Semester {student.semester}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}