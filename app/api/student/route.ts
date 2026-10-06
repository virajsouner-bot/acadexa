import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    if (!user.studentId) {
      return NextResponse.json(
        {
          error:
            "Your account is not linked to a student record.",
        },
        { status: 400 }
      );
    }

    // Find courses in which the student is enrolled
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.studentId,
      },
      select: {
        courseId: true,
      },
    });

    const courseIds = enrollments.map(
      (enrollment) => enrollment.courseId
    );

    // No courses enrolled
    if (courseIds.length === 0) {
      return NextResponse.json({
        assignments: [],
      });
    }

    // Find assignments for enrolled courses
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: {
          in: courseIds,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return NextResponse.json({
      assignments,
    });
  } catch (error) {
    console.error(
      "STUDENT ASSIGNMENTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load assignments.",
      },
      { status: 500 }
    );
  }
}