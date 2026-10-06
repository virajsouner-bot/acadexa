"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/sidebar";

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

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();

  const studentId = params.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadStudent() {
      try {
        const response = await fetch(
          `/api/students/${studentId}`
        );

        if (!response.ok) {
          throw new Error("Student not found");
        }

        const data: Student = await response.json();

        setStudent(data);
      } catch (error) {
        console.error(
          "Error loading student:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    if (studentId) {
      loadStudent();
    }
  }, [studentId]);

  function updateField(
    field: keyof Student,
    value: string
  ) {
    setStudent((currentStudent) => {
      if (!currentStudent) {
        return currentStudent;
      }

      return {
        ...currentStudent,
        [field]: value,
      };
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!student) {
      return;
    }

    if (
      !student.fullName ||
      !student.email ||
      !student.rollNumber ||
      !student.course ||
      !student.department ||
      !student.semester
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/students/${student.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: student.fullName,
            email: student.email,
            phone: student.phone,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            rollNumber: student.rollNumber,
            course: student.course,
            department: student.department,
            semester: student.semester,
            address: student.address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update student"
        );
      }

      alert("Student updated successfully.");

      router.push(`/students/${student.id}`);
    } catch (error) {
      console.error(
        "Error updating student:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update student."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-8">
          <p className="text-gray-600">
            Loading student...
          </p>
        </main>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Student Not Found
          </h1>

          <button
            type="button"
            onClick={() => router.push("/students")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Back to Students
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Edit Student
          </h1>

          <p className="mt-2 text-gray-600">
            Update student information.
          </p>

        </div>

        {/* Form */}
        <div className="rounded-xl bg-white p-8 shadow-sm">

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            {/* Personal Information */}
            <div>

              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    value={student.fullName}
                    onChange={(event) =>
                      updateField(
                        "fullName",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email *
                  </label>

                  <input
                    type="email"
                    value={student.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={student.phone || ""}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    value={student.dateOfBirth || ""}
                    onChange={(event) =>
                      updateField(
                        "dateOfBirth",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Gender
                  </label>

                  <select
                    value={student.gender || ""}
                    onChange={(event) =>
                      updateField(
                        "gender",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

              </div>

            </div>

            {/* Academic Information */}
            <div>

              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Academic Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Roll Number */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Roll Number *
                  </label>

                  <input
                    type="text"
                    value={student.rollNumber}
                    onChange={(event) =>
                      updateField(
                        "rollNumber",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Course */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Course *
                  </label>

                  <input
                    type="text"
                    value={student.course}
                    onChange={(event) =>
                      updateField(
                        "course",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Department *
                  </label>

                  <input
                    type="text"
                    value={student.department}
                    onChange={(event) =>
                      updateField(
                        "department",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Semester *
                  </label>

                  <select
                    value={student.semester}
                    onChange={(event) =>
                      updateField(
                        "semester",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select Semester
                    </option>

                    <option value="1">
                      Semester 1
                    </option>

                    <option value="2">
                      Semester 2
                    </option>

                    <option value="3">
                      Semester 3
                    </option>

                    <option value="4">
                      Semester 4
                    </option>

                    <option value="5">
                      Semester 5
                    </option>

                    <option value="6">
                      Semester 6
                    </option>

                    <option value="7">
                      Semester 7
                    </option>

                    <option value="8">
                      Semester 8
                    </option>
                  </select>
                </div>

              </div>

            </div>

            {/* Address */}
            <div>

              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Contact Information
              </h2>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <textarea
                value={student.address || ""}
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value
                  )
                }
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Buttons */}
            <div className="flex gap-4 border-t pt-6">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(`/students/${student.id}`)
                }
                className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}