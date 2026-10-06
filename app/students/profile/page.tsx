"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function StudentProfilePage() {
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/student/profile");
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }

          setError(data.error || "Failed to load profile.");
          return;
        }

        setStudent(data);
      } catch (error) {
        console.error(error);
        setError("Something went wrong while loading profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </main>
    );
  }

  if (!student) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-red-600">
            {error || "Student profile not found."}
          </p>

          <button
            onClick={() => router.push("/student")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
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
            Student Profile
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
            My Profile
          </h2>

          <p className="mt-2 text-gray-600">
            View your personal and academic information.
          </p>

        </div>

        {/* Profile Header */}
        <div className="mb-8 rounded-2xl bg-blue-600 p-8 text-white">

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-blue-600">
              {student.fullName.charAt(0).toUpperCase()}
            </div>

            <div>

              <h3 className="text-3xl font-bold">
                {student.fullName}
              </h3>

              <p className="mt-1 text-blue-100">
                Roll Number: {student.rollNumber}
              </p>

            </div>

          </div>

        </div>

        {/* Personal Information */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h3 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.fullName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.phone || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Date of Birth
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.dateOfBirth || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Gender
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.gender || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Address
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.address || "Not provided"}
              </p>
            </div>

          </div>

        </div>

        {/* Academic Information */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h3 className="text-xl font-semibold text-gray-900">
            Academic Information
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-sm text-gray-500">
                Roll Number
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.rollNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Course
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.course}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.department}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Semester
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {student.semester}
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}