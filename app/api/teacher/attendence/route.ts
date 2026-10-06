import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { authorized, user } = await requireRole([
      "TEACHER",
      "ADMIN",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        { error: "Teacher or Admin access required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date is required." },
        { status: 400 }
      );
    }

    const students = await prisma.student.findMany({
      orderBy: {
        fullName: "asc",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        rollNumber: true,
        course: true,
        department: true,
        semester: true,
      },
    });

    const attendance = await prisma.attendance.findMany({
      where: {
        date,
      },
    });

    const attendanceMap = new Map(
      attendance.map((record) => [
        record.studentId,
        record.status,
      ])
    );

    const result = students.map((student) => ({
      ...student,
      status: attendanceMap.get(student.id) || "Present",
    }));

    return NextResponse.json({
      success: true,
      date,
      students: result,
    });
  } catch (error) {
    console.error("TEACHER ATTENDANCE GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load attendance." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { authorized, user } = await requireRole([
      "TEACHER",
      "ADMIN",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        { error: "Teacher or Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { date, attendance } = body;

    if (!date || !Array.isArray(attendance)) {
      return NextResponse.json(
        { error: "Date and attendance data are required." },
        { status: 400 }
      );
    }

    for (const record of attendance) {
      const studentId = Number(record.studentId);

      if (!Number.isInteger(studentId)) {
        continue;
      }

      const status =
        record.status === "Absent" ? "Absent" : "Present";

      await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId,
            date,
          },
        },
        update: {
          status,
        },
        create: {
          studentId,
          date,
          status,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Attendance saved successfully.",
    });
  } catch (error) {
    console.error("TEACHER ATTENDANCE POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save attendance." },
      { status: 500 }
    );
  }
}