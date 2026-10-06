import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/courses/[id]/assignments
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // --------------------------------------------------
    // 1. Check authentication and role
    // --------------------------------------------------
    const { authorized, user } = await requireRole([
      "ADMIN",
      "TEACHER",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized. Admin or Teacher access required.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // 2. Get course ID from URL
    // --------------------------------------------------
    const { id } = await context.params;

    const courseId = Number(id);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid course ID.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 3. Check whether course exists
    // --------------------------------------------------
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        department: true,
        credits: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          error: "Course not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // 4. Get all assignments for this course
    // --------------------------------------------------
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: courseId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        maxMarks: true,
        courseId: true,
        createdAt: true,

        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: [
        {
          dueDate: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    // --------------------------------------------------
    // 5. Return course + assignments
    // --------------------------------------------------
    return NextResponse.json({
      success: true,

      course: {
        id: course.id,
        name: course.name,
        code: course.code,
        department: course.department,
        credits: course.credits,
      },

      assignments: assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks,
        courseId: assignment.courseId,
        createdAt: assignment.createdAt,

        submissionCount:
          assignment._count.submissions,
      })),

      totalAssignments: assignments.length,
    });
  } catch (error) {
    console.error(
      "GET COURSE ASSIGNMENTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load course assignments.",
      },
      { status: 500 }
    );
  }
}