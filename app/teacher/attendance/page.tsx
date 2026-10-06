
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: number;
  name: string;
  code: string;
  department: string;
  credits: number;
};

type Student = {
  id: number;
  fullName: string;
  rollNumber: string;
  email: string;
  department: string;
  semester: string;
};

export default function TeacherAttendancePage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedCourse, setSelectedCourse] =
    useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] =
    useState<Record<number, string>>({});

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [loadingStudents, setLoadingStudents] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* LOAD COURSES */
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoadingCourses(true);
        setError("");

        const response =
          await fetch("/api/courses");

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load courses."
          );
        }

        setCourses(data);

        if (data.length > 0) {
          setSelectedCourse(
            String(data[0].id)
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load courses."
        );
      } finally {
        setLoadingCourses(false);
      }
    }

    loadCourses();
  }, [router]);

  /* LOAD STUDENTS WHEN COURSE CHANGES */
  useEffect(() => {
    async function loadStudents() {
      if (!selectedCourse) {
        setStudents([]);
        return;
      }

      try {
        setLoadingStudents(true);
        setError("");
        setMessage("");

        const response = await fetch(
          `/api/courses/${selectedCourse}/students`
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load students."
          );
        }

        setStudents(data.students);

        const initialAttendance: Record<
          number,
          string
        > = {};

        data.students.forEach(
          (student: Student) => {
            initialAttendance[student.id] =
              "Present";
          }
        );

        setAttendance(initialAttendance);
      } catch (err) {
        setStudents([]);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load students."
        );
      } finally {
        setLoadingStudents(false);
      }
    }

    loadStudents();
  }, [selectedCourse, router]);

  /* UPDATE STATUS */
  function updateStatus(
    studentId: number,
    status: string
  ) {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  }

  /* MARK ALL */
  function markAll(status: string) {
    const updated: Record<
      number,
      string
    > = {};

    students.forEach((student) => {
      updated[student.id] = status;
    });

    setAttendance(updated);
  }

  /* SAVE ATTENDANCE */
  async function saveAttendance() {
    if (!selectedCourse) {
      setError("Please select a course.");
      return;
    }

    if (students.length === 0) {
      setError(
        "There are no students enrolled in this course."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      for (const student of students) {
        const response = await fetch(
          "/api/attendance",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              studentId: student.id,
              date,
              status:
                attendance[student.id] ||
                "Present",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              `Failed to save attendance for ${student.fullName}.`
          );
        }
      }

      setMessage(
        "Attendance saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save attendance."
      );
    } finally {
      setSaving(false);
    }
  }

  /* LOADING COURSES */
  if (loadingCourses) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <p className="text-gray-600">
          Loading courses...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">

          <button
            onClick={() => router.back()}
            className="mb-3 text-sm font-medium text-[#16a34a] hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-[#17221c]">
            Mark Attendance
          </h1>

          <p className="mt-2 text-gray-600">
            Select a course and mark attendance
            for enrolled students.
          </p>

        </div>

        {/* COURSE + DATE */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* COURSE */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-[#17221c]">
                Select Course
              </label>

              {courses.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-4 text-gray-600">
                  No courses found.
                </div>
              ) : (
                <select
                  value={selectedCourse}
                  onChange={(event) =>
                    setSelectedCourse(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#17221c] outline-none focus:border-[#16a34a]"
                >
                  {courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.code} —{" "}
                      {course.name}
                    </option>
                  ))}
                </select>
              )}

            </div>

            {/* DATE */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-[#17221c]">
                Attendance Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#17221c] outline-none focus:border-[#16a34a]"
              />

            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-5 flex flex-wrap gap-3">

            <button
              onClick={() =>
                markAll("Present")
              }
              disabled={students.length === 0}
              className="rounded-lg bg-[#16a34a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark All Present
            </button>

            <button
              onClick={() =>
                markAll("Absent")
              }
              disabled={students.length === 0}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark All Absent
            </button>

          </div>

        </div>

        {/* MESSAGES */}
        {message && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* STUDENTS */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="text-xl font-bold text-[#17221c]">
              Enrolled Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {students.length} student
              {students.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

          {loadingStudents ? (

            <div className="rounded-xl bg-[#f5f7f6] p-8 text-center">
              <p className="text-gray-600">
                Loading students...
              </p>
            </div>

          ) : students.length === 0 ? (

            <div className="rounded-xl bg-[#f5f7f6] p-8 text-center">

              <div className="text-4xl">
                👨‍🎓
              </div>

              <p className="mt-3 font-medium text-[#17221c]">
                No students enrolled.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Enroll students in this course
                before marking attendance.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b border-gray-200">

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      #
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Student
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Roll Number
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {students.map(
                    (student, index) => {

                      const status =
                        attendance[
                          student.id
                        ] || "Present";

                      return (
                        <tr
                          key={student.id}
                          className="border-b border-gray-100"
                        >

                          <td className="px-4 py-4 text-sm text-gray-500">
                            {index + 1}
                          </td>

                          <td className="px-4 py-4">

                            <p className="font-medium text-[#17221c]">
                              {student.fullName}
                            </p>

                            <p className="text-sm text-gray-500">
                              {student.email}
                            </p>

                          </td>

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {student.rollNumber}
                          </td>

                          <td className="px-4 py-4">

                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  updateStatus(
                                    student.id,
                                    "Present"
                                  )
                                }
                                className={
                                  status ===
                                  "Present"
                                    ? "rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white"
                                    : "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                }
                              >
                                Present
                              </button>

                              <button
                                onClick={() =>
                                  updateStatus(
                                    student.id,
                                    "Absent"
                                  )
                                }
                                className={
                                  status ===
                                  "Absent"
                                    ? "rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white"
                                    : "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                }
                              >
                                Absent
                              </button>

                            </div>

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

        {/* SAVE */}
        {students.length > 0 && (
          <div className="mt-6 flex justify-end">

            <button
              onClick={saveAttendance}
              disabled={saving}
              className="rounded-lg bg-[#16a34a] px-6 py-3 font-medium text-white hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving Attendance..."
                : "Save Attendance"}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

