import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const auth = await requireRole(["ADMIN", "TEACHER"]);

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const attendance = await prisma.attendance.findMany({
      where: date ? { date } : undefined,
      include: { student: true },
      orderBy: { studentId: "asc" },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);

    return NextResponse.json(
      { error: "Failed to fetch attendance." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(["ADMIN", "TEACHER"]);

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!data.studentId || !data.date || !data.status) {
      return NextResponse.json(
        {
          error: "Student, date and attendance status are required.",
        },
        { status: 400 }
      );
    }

    if (!["Present", "Absent"].includes(data.status)) {
      return NextResponse.json(
        { error: "Invalid attendance status." },
        { status: 400 }
      );
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: Number(data.studentId),
          date: data.date,
        },
      },
      update: {
        status: data.status,
      },
      create: {
        studentId: Number(data.studentId),
        date: data.date,
        status: data.status,
      },
    });

    return NextResponse.json(attendance, {
      status: 201,
    });
  } catch (error) {
    console.error("Error saving attendance:", error);

    return NextResponse.json(
      { error: "Failed to save attendance." },
      { status: 500 }
    );
  }
}