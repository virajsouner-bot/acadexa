import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
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
        marks: {
          orderBy: {
            subject: "asc",
          },
          select: {
            id: true,
            subject: true,
            marks: true,
            maxMarks: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("TEACHER MARKS GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load marks." },
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

    const {
      studentId,
      subject,
      marks,
      maxMarks,
    } = body;

    const parsedStudentId = Number(studentId);
    const parsedMarks = Number(marks);
    const parsedMaxMarks = Number(maxMarks);

    if (
      !Number.isInteger(parsedStudentId) ||
      !subject ||
      !Number.isFinite(parsedMarks) ||
      !Number.isFinite(parsedMaxMarks)
    ) {
      return NextResponse.json(
        { error: "Invalid marks information." },
        { status: 400 }
      );
    }

    if (parsedMarks < 0 || parsedMarks > parsedMaxMarks) {
      return NextResponse.json(
        { error: "Marks must be between 0 and maximum marks." },
        { status: 400 }
      );
    }

    if (parsedMaxMarks <= 0) {
      return NextResponse.json(
        { error: "Maximum marks must be greater than 0." },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id: parsedStudentId,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    const result = await prisma.mark.upsert({
      where: {
        studentId_subject: {
          studentId: parsedStudentId,
          subject: String(subject).trim(),
        },
      },
      update: {
        marks: parsedMarks,
        maxMarks: parsedMaxMarks,
      },
      create: {
        studentId: parsedStudentId,
        subject: String(subject).trim(),
        marks: parsedMarks,
        maxMarks: parsedMaxMarks,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Marks saved successfully.",
      mark: result,
    });
  } catch (error) {
    console.error("TEACHER MARKS POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save marks." },
      { status: 500 }
    );
  }
}