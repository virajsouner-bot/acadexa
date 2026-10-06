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

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response = await fetch(
        "/api/student/profile"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load profile."
        );
      }

      setStudent(data.student);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  function display(value: string | null | undefined) {
    return value && value.trim()
      ? value
      : "Not provided";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">
            👤
          </div>

          <p className="text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] p-8">
        <div className="bg-white rounded-2xl p-8 border border-red-100">
          <h1 className="text-xl font-bold text-red-500">
            Unable to load profile
          </h1>

          <p className="text-gray-600 mt-2">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-semibold text-green-600">
          Student Account
        </p>

        <h1 className="text-3xl font-bold text-[#17221c] mt-1">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          View your personal and academic information.
        </p>
      </div>

      {/* Profile Header */}

      <div className="bg-[#17221c] rounded-3xl p-7 md:p-9 text-white mb-6">

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-4xl font-bold">
            {student.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="text-center sm:text-left">

            <h2 className="text-3xl font-bold">
              {student.fullName}
            </h2>

            <p className="text-gray-300 mt-2">
              {student.email}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">

              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-semibold">
                {student.rollNumber}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 text-sm">
                Semester {student.semester}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Academic Information */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        <h2 className="text-xl font-bold text-[#17221c] mb-6">
          Academic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <InfoCard
            label="Roll Number"
            value={student.rollNumber}
          />

          <InfoCard
            label="Course"
            value={student.course}
          />

          <InfoCard
            label="Department"
            value={student.department}
          />

          <InfoCard
            label="Semester"
            value={`Semester ${student.semester}`}
          />

        </div>

      </div>

      {/* Personal Information */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        <h2 className="text-xl font-bold text-[#17221c] mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <InfoCard
            label="Full Name"
            value={student.fullName}
          />

          <InfoCard
            label="Email"
            value={student.email}
          />

          <InfoCard
            label="Phone"
            value={display(student.phone)}
          />

          <InfoCard
            label="Date of Birth"
            value={display(student.dateOfBirth)}
          />

          <InfoCard
            label="Gender"
            value={display(student.gender)}
          />

          <InfoCard
            label="Student ID"
            value={`#${student.id}`}
          />

        </div>

      </div>

      {/* Address */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <h2 className="text-xl font-bold text-[#17221c] mb-5">
          Address
        </h2>

        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-gray-700">
            {display(student.address)}
          </p>
        </div>

      </div>

    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-4">

      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-800 mt-2 break-words">
        {value}
      </p>

    </div>
  );
}