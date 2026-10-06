import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { authorized, user } = await requireRole([
      "ADMIN",
      "TEACHER",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const courseId = Number(id);

    if (!Number.isInteger(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId: courseId,
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            rollNumber: true,
            email: true,
            department: true,
            semester: true,
          },
        },
      },
      orderBy: {
        student: {
          fullName: "asc",
        },
      },
    });

    const students = enrollments.map(
      (enrollment) => enrollment.student
    );

    console.log("COURSE:", course.name);
    console.log("COURSE ID:", courseId);
    console.log("ENROLLED STUDENTS:", students);

    return NextResponse.json({
      course,
      students,
    });
  } catch (error) {
    console.error("COURSE STUDENTS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load course students.",
      },
      { status: 500 }
    );
  }
}