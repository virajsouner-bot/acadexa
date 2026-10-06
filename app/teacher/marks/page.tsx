"use client";

import { useEffect, useState } from "react";

type Mark = {
  id: number;
  subject: string;
  marks: number;
  maxMarks: number;
};

type Student = {
  id: number;
  fullName: string;
  email: string;
  rollNumber: string;
  course: string;
  department: string;
  semester: string;
  marks: Mark[];
};

export default function TeacherMarksPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [search, setSearch] = useState("");

  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const response = await fetch("/api/teacher/marks");

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

  function selectStudent(student: Student) {
    setSelectedStudent(student);
    setMessage("");
    setError("");
  }

  async function saveMarks() {
    if (!selectedStudent) {
      setError("Please select a student first.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (marks === "") {
      setError("Please enter marks.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/teacher/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          subject: subject.trim(),
          marks: Number(marks),
          maxMarks: Number(maxMarks),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save marks.");
        return;
      }

      setMessage("Marks saved successfully.");

      setSubject("");
      setMarks("");
      setMaxMarks("100");

      await loadStudents();

      const refreshed = await fetch("/api/teacher/marks");
      const refreshedData = await refreshed.json();

      const updatedStudent = refreshedData.students?.find(
        (student: Student) =>
          student.id === selectedStudent.id
      );

      if (updatedStudent) {
        setSelectedStudent(updatedStudent);
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const filteredStudents = students.filter((student) => {
    const text = search.toLowerCase();

    return (
      student.fullName.toLowerCase().includes(text) ||
      student.email.toLowerCase().includes(text) ||
      student.rollNumber.toLowerCase().includes(text)
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
          Marks Management
        </h1>

        <p className="mt-2 text-gray-500">
          Enter and manage student marks.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Students */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-[#17221c]">
            Students
          </h2>

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          {loading ? (
            <p className="text-gray-500">
              Loading students...
            </p>
          ) : (
            <div className="max-h-[600px] space-y-2 overflow-y-auto">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => selectStudent(student)}
                  className={`w-full rounded-xl p-4 text-left transition ${
                    selectedStudent?.id === student.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-50 hover:bg-green-50"
                  }`}
                >
                  <p className="font-semibold">
                    {student.fullName}
                  </p>

                  <p
                    className={`text-sm ${
                      selectedStudent?.id === student.id
                        ? "text-green-100"
                        : "text-gray-500"
                    }`}
                  >
                    {student.rollNumber}
                  </p>
                </button>
              ))}

              {filteredStudents.length === 0 && (
                <p className="py-6 text-center text-gray-500">
                  No students found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Marks Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          {!selectedStudent ? (
            <div className="flex min-h-[400px] items-center justify-center text-center">
              <div>
                <div className="mb-4 text-5xl">📊</div>

                <h2 className="text-xl font-bold text-[#17221c]">
                  Select a Student
                </h2>

                <p className="mt-2 text-gray-500">
                  Select a student from the left to enter marks.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Selected Student */}
              <div className="mb-6 rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Selected Student
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#17221c]">
                  {selectedStudent.fullName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedStudent.rollNumber} •{" "}
                  {selectedStudent.course}
                </p>
              </div>

              {/* Form */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-[#17221c]">
                  Add / Update Marks
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-600">
                      Subject
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Mathematics"
                      value={subject}
                      onChange={(e) =>
                        setSubject(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-600">
                      Marks
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={marks}
                      onChange={(e) =>
                        setMarks(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-600">
                      Maximum Marks
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={maxMarks}
                      onChange={(e) =>
                        setMaxMarks(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <button
                  onClick={saveMarks}
                  disabled={saving}
                  className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Marks"}
                </button>
              </div>

              {/* Existing Marks */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-[#17221c]">
                  Existing Marks
                </h3>

                {selectedStudent.marks.length === 0 ? (
                  <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
                    No marks entered yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-4 py-3 text-left text-sm text-gray-500">
                            Subject
                          </th>

                          <th className="px-4 py-3 text-left text-sm text-gray-500">
                            Marks
                          </th>

                          <th className="px-4 py-3 text-left text-sm text-gray-500">
                            Percentage
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedStudent.marks.map((mark) => {
                          const percentage =
                            mark.maxMarks > 0
                              ? Math.round(
                                  (mark.marks /
                                    mark.maxMarks) *
                                    100
                                )
                              : 0;

                          return (
                            <tr
                              key={mark.id}
                              className="border-b border-gray-100"
                            >
                              <td className="px-4 py-4 font-medium">
                                {mark.subject}
                              </td>

                              <td className="px-4 py-4">
                                {mark.marks} / {mark.maxMarks}
                              </td>

                              <td className="px-4 py-4 font-semibold text-green-600">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}