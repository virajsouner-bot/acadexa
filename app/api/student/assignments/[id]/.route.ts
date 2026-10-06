import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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
    console.log("=================================");
    console.log("STUDENT ASSIGNMENT API CALLED");
    console.log("=================================");

    // 1. Get logged-in user
    const user = await getCurrentUser();

    console.log("CURRENT USER:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Please login first." },
        { status: 401 }
      );
    }

    // 2. Check student account
    if (!user.studentId) {
      return NextResponse.json(
        {
          error:
            "Your account is not linked to a student record.",
        },
        { status: 400 }
      );
    }

    // 3. Get assignment ID
    const { id } = await context.params;

    const assignmentId = Number(id);

    console.log("ASSIGNMENT ID:", assignmentId);

    if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
      return NextResponse.json(
        { error: "Invalid assignment ID." },
        { status: 400 }
      );
    }

    // 4. Find assignment
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
            department: true,
            credits: true,
          },
        },
      },
    });

    console.log("ASSIGNMENT:", assignment);

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found." },
        { status: 404 }
      );
    }

    // 5. Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.studentId,
          courseId: assignment.courseId,
        },
      },
    });

    console.log("ENROLLMENT:", enrollment);

    if (!enrollment) {
      return NextResponse.json(
        {
          error:
            "You are not enrolled in this course.",
        },
        { status: 403 }
      );
    }

    // 6. Find existing submission
    const submission = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId: assignment.id,
          studentId: user.studentId,
        },
      },
      select: {
        id: true,
        fileName: true,
        filePath: true,
        submittedAt: true,
        status: true,
        marks: true,
        feedback: true,
      },
    });

    // 7. Return response
    return NextResponse.json({
      success: true,
      assignment: {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks,
        courseId: assignment.courseId,
        createdAt: assignment.createdAt,
        course: assignment.course,
        submission: submission,
      },
    });
  } catch (error) {
    console.error(
      "STUDENT ASSIGNMENT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Server error while loading assignment.",
      },
      { status: 500 }
    );
  }
}