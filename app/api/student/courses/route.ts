import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please login first." },
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

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.studentId,
      },
      include: {
        course: {
          include: {
            _count: {
              select: {
                assignments: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const courses = enrollments.map((enrollment) => ({
      id: enrollment.course.id,
      name: enrollment.course.name,
      code: enrollment.course.code,
      department: enrollment.course.department,
      credits: enrollment.course.credits,
      assignmentCount: enrollment.course._count.assignments,
      enrolledAt: enrollment.createdAt,
    }));

    return NextResponse.json({
      success: true,
      courses,
      totalCourses: courses.length,
    });
  } catch (error) {
    console.error("STUDENT COURSES ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load your courses.",
      },
      { status: 500 }
    );
  }
}