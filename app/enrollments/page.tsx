"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  fullName: string;
  email: string;
  rollNumber: string;
};

type Course = {
  id: number;
  name: string;
  code: string;
  department: string;
  credits: number;
};

type Enrollment = {
  id: number;
  student: Student;
  course: Course;
};

export default function EnrollmentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // SAFE JSON RESPONSE HANDLER
  // ---------------------------------------------------------

  async function getJson(
    response: Response,
    apiName: string
  ) {
    const contentType =
      response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      await response.text();

      throw new Error(
        `${apiName} returned ${response.status} ${response.statusText}, not JSON.`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          `${apiName} request failed.`
      );
    }

    return data;
  }

  // ---------------------------------------------------------
  // LOAD STUDENTS, COURSES AND ENROLLMENTS
  // ---------------------------------------------------------

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      // -------------------------
      // STUDENTS
      // -------------------------

      const studentsResponse = await fetch(
        "/api/students",
        {
          cache: "no-store",
        }
      );

      if (studentsResponse.status === 401) {
        window.location.href = "/login";
        return;
      }

      const studentsData = await getJson(
        studentsResponse,
        "/api/students"
      );

      // -------------------------
      // COURSES
      // -------------------------

      const coursesResponse = await fetch(
        "/api/courses",
        {
          cache: "no-store",
        }
      );

      if (coursesResponse.status === 401) {
        window.location.href = "/login";
        return;
      }

      const coursesData = await getJson(
        coursesResponse,
        "/api/courses"
      );

      // -------------------------
      // ENROLLMENTS
      // -------------------------

      const enrollmentsResponse = await fetch(
        "/api/enrollments",
        {
          cache: "no-store",
        }
      );

      if (enrollmentsResponse.status === 401) {
        window.location.href = "/login";
        return;
      }

      const enrollmentsData = await getJson(
        enrollmentsResponse,
        "/api/enrollments"
      );

      // -------------------------
      // SAVE DATA
      // -------------------------

      setStudents(studentsData);
      setCourses(coursesData);
      setEnrollments(enrollmentsData);

    } catch (err) {
      console.error(
        "ENROLLMENT PAGE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load enrollment data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ---------------------------------------------------------
  // ENROLL STUDENT
  // ---------------------------------------------------------

  async function enrollStudent() {
    if (!selectedStudent || !selectedCourse) {
      setError(
        "Please select both a student and a course."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/enrollments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: Number(selectedStudent),
            courseId: Number(selectedCourse),
          }),
        }
      );

      const data = await getJson(
        response,
        "/api/enrollments"
      );

      console.log(
        "Enrollment created:",
        data
      );

      setMessage(
        "Student enrolled successfully."
      );

      setSelectedStudent("");
      setSelectedCourse("");

      await loadData();

    } catch (err) {
      console.error(
        "ENROLL STUDENT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to enroll student."
      );
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------------------------
  // REMOVE ENROLLMENT
  // ---------------------------------------------------------

  async function removeEnrollment(
    id: number
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this enrollment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/enrollments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await getJson(
        response,
        `/api/enrollments/${id}`
      );

      console.log(
        "Enrollment removed:",
        data
      );

      setMessage(
        "Enrollment removed successfully."
      );

      await loadData();

    } catch (err) {
      console.error(
        "REMOVE ENROLLMENT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove enrollment."
      );
    }
  }

  // ---------------------------------------------------------
  // LOADING SCREEN
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-gray-600">
              Loading enrollment management...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN PAGE
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#17221c]">
            Enrollment Management
          </h1>

          <p className="mt-2 text-gray-600">
            Enroll students into courses and manage
            existing enrollments.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-medium">
              {error}
            </p>
          </div>
        )}

        {/* ENROLL STUDENT CARD */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-[#17221c]">
            Enroll Student
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select a student and course to create
            an enrollment.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* STUDENT */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#17221c]">
                Student
              </label>

              <select
                value={selectedStudent}
                onChange={(event) =>
                  setSelectedStudent(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#17221c] outline-none focus:border-[#16a34a]"
              >
                <option value="">
                  Select Student
                </option>

                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.rollNumber} —{" "}
                    {student.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* COURSE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#17221c]">
                Course
              </label>

              <select
                value={selectedCourse}
                onChange={(event) =>
                  setSelectedCourse(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#17221c] outline-none focus:border-[#16a34a]"
              >
                <option value="">
                  Select Course
                </option>

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
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={enrollStudent}
              disabled={saving}
              className="rounded-lg bg-[#16a34a] px-6 py-3 font-medium text-white transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Enrolling..."
                : "Enroll Student"}
            </button>
          </div>
        </div>

        {/* CURRENT ENROLLMENTS */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#17221c]">
              Current Enrollments
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {enrollments.length} enrollment
              {enrollments.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          {/* NO ENROLLMENTS */}
          {enrollments.length === 0 ? (
            <div className="rounded-xl bg-[#f5f7f6] p-8 text-center">

              <div className="text-4xl">
                📚
              </div>

              <p className="mt-3 font-medium text-[#17221c]">
                No enrollments found.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Use the form above to enroll a
                student.
              </p>

            </div>
          ) : (

            /* TABLE */
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-gray-200">

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Student
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Roll Number
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Course
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Code
                    </th>

                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {enrollments.map(
                    (enrollment) => (
                      <tr
                        key={enrollment.id}
                        className="border-b border-gray-100"
                      >

                        {/* STUDENT */}
                        <td className="px-4 py-4">

                          <p className="font-medium text-[#17221c]">
                            {
                              enrollment.student
                                .fullName
                            }
                          </p>

                          <p className="text-sm text-gray-500">
                            {
                              enrollment.student
                                .email
                            }
                          </p>

                        </td>

                        {/* ROLL NUMBER */}
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {
                            enrollment.student
                              .rollNumber
                          }
                        </td>

                        {/* COURSE */}
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {
                            enrollment.course
                              .name
                          }
                        </td>

                        {/* COURSE CODE */}
                        <td className="px-4 py-4">

                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            {
                              enrollment.course
                                .code
                            }
                          </span>

                        </td>

                        {/* DELETE */}
                        <td className="px-4 py-4 text-right">

                          <button
                            onClick={() =>
                              removeEnrollment(
                                enrollment.id
                              )
                            }
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Remove
                          </button>

                        </td>

                      </tr>
                    )
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