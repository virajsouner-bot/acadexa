"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  fullName: string;
  rollNumber: string;
};

type Mark = {
  id: number;
  subject: string;
  marks: number;
  maxMarks: number;
  student: {
    fullName: string;
    rollNumber: string;
  };
};

export default function TeacherMarksForm() {
  const [students, setStudents] = useState<Student[]>([]);
  const [marksList, setMarksList] = useState<Mark[]>([]);

  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const studentsResponse = await fetch("/api/students");
      const studentsData = await studentsResponse.json();

      if (!studentsResponse.ok) {
        setError(
          studentsData.error || "Failed to load students."
        );
        return;
      }

      setStudents(studentsData);

      const marksResponse = await fetch("/api/marks");
      const marksData = await marksResponse.json();

      if (!marksResponse.ok) {
        setError(
          marksData.error || "Failed to load marks."
        );
        return;
      }

      setMarksList(marksData);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while loading data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: Number(studentId),
          subject,
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

      setStudentId("");
      setSubject("");
      setMarks("");
      setMaxMarks("100");

      await loadData();
    } catch (error) {
      console.error(error);
      setError("Something went wrong while saving marks.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">
          Loading marks...
        </p>
      </div>
    );
  }

  return (
    <div>

      {/* Form */}
      <div className="rounded-xl bg-white p-8 shadow-sm">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Enter Student Marks
          </h2>

          <p className="mt-1 text-gray-500">
            Select a student and enter their marks.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-lg bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Student */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Student
            </label>

            <select
              value={studentId}
              onChange={(event) =>
                setStudentId(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Select a student
              </option>

              {students.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.fullName} - {student.rollNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              placeholder="e.g. Mathematics"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Marks */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Marks Obtained
              </label>

              <input
                type="number"
                value={marks}
                onChange={(event) =>
                  setMarks(event.target.value)
                }
                placeholder="e.g. 85"
                min="0"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Maximum Marks
              </label>

              <input
                type="number"
                value={maxMarks}
                onChange={(event) =>
                  setMaxMarks(event.target.value)
                }
                min="1"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving Marks..."
              : "Save Marks"}
          </button>

        </form>

      </div>

      {/* Marks History */}
      <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b p-6">

          <h2 className="text-xl font-semibold text-gray-900">
            Marks History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Previously entered student marks.
          </p>

        </div>

        {marksList.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No marks have been entered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b bg-gray-50">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Roll Number
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

                {marksList.map((record) => {

                  const percentage =
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

                      <td className="px-6 py-4 font-medium text-gray-900">
                        {record.student.fullName}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {record.student.rollNumber}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {record.subject}
                      </td>

                      <td className="px-6 py-4 text-center font-medium text-gray-900">
                        {record.marks}
                      </td>

                      <td className="px-6 py-4 text-center text-gray-600">
                        {record.maxMarks}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-purple-600">
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

    </div>
  );
}