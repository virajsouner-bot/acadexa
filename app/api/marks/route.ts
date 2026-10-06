import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await requireRole(["ADMIN", "TEACHER"]);

    if (!auth.user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
      );
    }

    const marks = await prisma.mark.findMany({
      include: {
        student: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error);

    return NextResponse.json(
      { error: "Failed to fetch marks." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(["ADMIN", "TEACHER"]);

    if (!auth.user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
      );
    }

    const data = await request.json();

    const studentId = Number(data.studentId);
    const marks = Number(data.marks);
    const maxMarks = Number(data.maxMarks);
    const subject = data.subject?.trim();

    if (
      !studentId ||
      !subject ||
      Number.isNaN(marks) ||
      Number.isNaN(maxMarks)
    ) {
      return NextResponse.json(
        {
          error:
            "Student, subject, marks and maximum marks are required.",
        },
        { status: 400 }
      );
    }

    if (maxMarks <= 0) {
      return NextResponse.json(
        {
          error: "Maximum marks must be greater than 0.",
        },
        { status: 400 }
      );
    }

    if (marks < 0 || marks > maxMarks) {
      return NextResponse.json(
        {
          error:
            "Marks must be between 0 and maximum marks.",
        },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          error: "Student not found.",
        },
        { status: 404 }
      );
    }

    const result = await prisma.mark.upsert({
      where: {
        studentId_subject: {
          studentId,
          subject,
        },
      },
      update: {
        marks,
        maxMarks,
      },
      create: {
        studentId,
        subject,
        marks,
        maxMarks,
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("Error saving marks:", error);

    return NextResponse.json(
      { error: "Failed to save marks." },
      { status: 500 }
    );
  }
}