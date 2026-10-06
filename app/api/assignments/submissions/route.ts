import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // -----------------------------------------
    // 1. Check teacher/admin access
    // -----------------------------------------
    const { authorized, user } = await requireRole([
      "ADMIN",
      "TEACHER",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Admin or Teacher access required.",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // 2. Get assignment ID
    // -----------------------------------------
    const { id } = await context.params;

    const assignmentId = Number(id);

    if (
      !Number.isInteger(assignmentId) ||
      assignmentId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid assignment ID.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 3. Find assignment
    // -----------------------------------------
    const assignment =
      await prisma.assignment.findUnique({
        where: {
          id: assignmentId,
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
      });

    if (!assignment) {
      return NextResponse.json(
        {
          error: "Assignment not found.",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // 4. Get submissions
    // -----------------------------------------
    const submissions =
      await prisma.submission.findMany({
        where: {
          assignmentId,
        },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              email: true,
              rollNumber: true,
              department: true,
              semester: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      });

    // -----------------------------------------
    // 5. Return data
    // -----------------------------------------
    return NextResponse.json({
      success: true,

      assignment: {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks,
        courseId: assignment.courseId,
        course: assignment.course,
      },

      submissions,

      totalSubmissions: submissions.length,
    });
  } catch (error) {
    console.error(
      "GET ASSIGNMENT SUBMISSIONS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load assignment submissions.",
      },
      { status: 500 }
    );
  }
}