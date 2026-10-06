"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  rollNumber: string;
  course: string;
  department: string;
  semester: string;
  address: string | null;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStudents() {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load students.");
        return;
      }

      setStudents(data);
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function deleteStudent(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete student.");
        return;
      }

      alert("Student deleted successfully.");

      loadStudents();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the student.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Loading students...
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
            Student Management
          </p>
        </div>

        <div className="flex gap-3">

          <a
            href="/"
            className="rounded-lg bg-gray-200 px-5 py-2 font-medium text-gray-700 hover:bg-gray-300"
          >
            Dashboard
          </a>

          <a
            href="/students/add"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            + Add Student
          </a>

        </div>

      </header>

      <div className="p-8">

        {/* Page heading */}
        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Students
          </h2>

          <p className="mt-2 text-gray-600">
            View and manage all registered students.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Student count */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Students
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {students.length}
          </p>

        </div>

        {/* Students table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="border-b p-6">

            <h3 className="text-xl font-semibold text-gray-900">
              Student List
            </h3>

          </div>

          {students.length === 0 ? (
            <div className="p-10 text-center">

              <p className="text-gray-500">
                No students found.
              </p>

              <a
                href="/students/add"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
              >
                Add First Student
              </a>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Roll Number
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Course
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Semester
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {students.map((student) => (

                    <tr
                      key={student.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium text-gray-900">
                        {student.fullName}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {student.rollNumber}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {student.email}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {student.course}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {student.department}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {student.semester}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-center gap-2">

                          <a
                            href={`/students/${student.id}`}
                            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                          >
                            View
                          </a>

                          <a
                            href={`/students/${student.id}/edit`}
                            className="rounded-lg bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
                          >
                            Edit
                          </a>

                          <button
                            onClick={() =>
                              deleteStudent(student.id)
                            }
                            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>

                        </div>

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