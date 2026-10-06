"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Teacher = {
  id: number;
  fullName: string;
  email: string;
  department: string;
  designation: string | null;
  employeeId: string;
};

export default function TeacherDashboardPage() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacher();
  }, []);

  async function loadTeacher() {
    try {
      const response = await fetch("/api/teacher/profile");

      if (!response.ok) {
        throw new Error("Failed to load teacher profile.");
      }

      const data = await response.json();

      setTeacher(data.teacher);
    } catch (error) {
      console.error("TEACHER DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">👨‍🏫</div>

          <p className="text-gray-500">
            Loading teacher dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">

      {/* Welcome */}

      <div className="bg-[#17221c] rounded-3xl p-7 md:p-9 text-white mb-8">

        <p className="text-green-400 font-medium mb-2">
          Faculty Learning Portal
        </p>

        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome back
          {teacher?.fullName
            ? `, ${teacher.fullName}`
            : ""}! 👋
        </h1>

        <p className="text-gray-300 mt-3">
          Manage your students, attendance, marks and assignments
          from one place.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">

          <Link
            href="/teacher/students"
            className="px-5 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] transition"
          >
            My Students →
          </Link>

          <Link
            href="/teacher/assignments"
            className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition"
          >
            Assignments
          </Link>

        </div>

      </div>

      {/* Teacher Information */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

          <p className="text-sm text-gray-500">
            Employee ID
          </p>

          <p className="text-2xl font-bold text-[#17221c] mt-2">
            {teacher?.employeeId || "—"}
          </p>

        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

          <p className="text-sm text-gray-500">
            Department
          </p>

          <p className="text-2xl font-bold text-[#17221c] mt-2">
            {teacher?.department || "—"}
          </p>

        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

          <p className="text-sm text-gray-500">
            Designation
          </p>

          <p className="text-2xl font-bold text-[#17221c] mt-2">
            {teacher?.designation || "Faculty"}
          </p>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-[#17221c]">
            Teaching Tools
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Frequently used faculty tools
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <TeacherAction
            href="/teacher/students"
            icon="👨‍🎓"
            title="Students"
            description="View your students"
          />

          <TeacherAction
            href="/teacher/attendance"
            icon="📋"
            title="Attendance"
            description="Mark attendance"
          />

          <TeacherAction
            href="/teacher/marks"
            icon="📊"
            title="Marks"
            description="Enter student marks"
          />

          <TeacherAction
            href="/teacher/assignments"
            icon="📝"
            title="Assignments"
            description="Create and review assignments"
          />

        </div>

      </div>

      {/* Teaching Workflow */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <h2 className="text-xl font-bold text-[#17221c]">
          Teaching Workflow
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          Manage your academic activities
        </p>

        <div className="space-y-4">

          <WorkflowItem
            number="01"
            title="View Students"
            description="Check students assigned to your classes."
            href="/teacher/students"
          />

          <WorkflowItem
            number="02"
            title="Mark Attendance"
            description="Record daily attendance for your students."
            href="/teacher/attendance"
          />

          <WorkflowItem
            number="03"
            title="Enter Marks"
            description="Add and update academic marks."
            href="/teacher/marks"
          />

          <WorkflowItem
            number="04"
            title="Manage Assignments"
            description="Create assignments and evaluate submissions."
            href="/teacher/assignments"
          />

        </div>

      </div>

    </div>
  );
}

function TeacherAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="border border-gray-100 rounded-xl p-5 hover:border-green-300 hover:bg-green-50/30 transition"
    >
      <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-xl mb-4">
        {icon}
      </div>

      <h3 className="font-bold text-[#17221c]">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>
    </Link>
  );
}

function WorkflowItem({
  number,
  title,
  description,
  href,
}: {
  number: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-5 p-4 rounded-xl hover:bg-gray-50 transition"
    >
      <div className="w-12 h-12 rounded-xl bg-[#17221c] text-white flex items-center justify-center font-bold">
        {number}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-[#17221c]">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>
      </div>

      <span className="text-green-600 font-bold">
        →
      </span>
    </Link>
  );
}