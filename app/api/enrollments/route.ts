import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const { authorized } = await requireRole(["ADMIN"]);

    if (!authorized) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            rollNumber: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true,
            department: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("ENROLLMENTS GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load enrollments." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { authorized } = await requireRole(["ADMIN"]);

    if (!authorized) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const studentId = Number(body.studentId);
    const courseId = Number(body.courseId);

    if (!Number.isInteger(studentId) || !Number.isInteger(courseId)) {
      return NextResponse.json(
        { error: "Valid student and course are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Student is already enrolled in this course." },
        { status: 409 }
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
      },
      include: {
        student: true,
        course: true,
      },
    });

    return NextResponse.json(enrollment, {
      status: 201,
    });
  } catch (error) {
    console.error("ENROLLMENT POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create enrollment." },
      { status: 500 }
    );
  }
}