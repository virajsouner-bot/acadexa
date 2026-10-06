import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    // -----------------------------------------
    // 1. Check logged-in user
    // -----------------------------------------
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Please login first.",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // 2. Check student account
    // -----------------------------------------
    if (!user.studentId) {
      return NextResponse.json(
        {
          error:
            "Your account is not linked to a student record.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 3. Get assignment ID
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
    // 4. Find assignment
    // -----------------------------------------
    const assignment =
      await prisma.assignment.findUnique({
        where: {
          id: assignmentId,
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
    // 5. Check enrollment
    // -----------------------------------------
    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.studentId,
            courseId: assignment.courseId,
          },
        },
      });

    if (!enrollment) {
      return NextResponse.json(
        {
          error:
            "You are not enrolled in this course.",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // 6. Read submitted data
    // -----------------------------------------
    const body = await request.json();

    const fileName = body.fileName;
    const filePath = body.filePath ?? null;

    if (
      !fileName ||
      typeof fileName !== "string" ||
      !fileName.trim()
    ) {
      return NextResponse.json(
        {
          error: "File name is required.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 7. Check existing submission
    // -----------------------------------------
    const existingSubmission =
      await prisma.submission.findUnique({
        where: {
          assignmentId_studentId: {
            assignmentId: assignment.id,
            studentId: user.studentId,
          },
        },
      });

    // -----------------------------------------
    // 8. Update existing submission
    // -----------------------------------------
    if (existingSubmission) {
      const submission =
        await prisma.submission.update({
          where: {
            id: existingSubmission.id,
          },
          data: {
            fileName: fileName.trim(),
            filePath,
            submittedAt: new Date(),
            status: "Resubmitted",
          },
        });

      return NextResponse.json({
        success: true,
        message:
          "Assignment resubmitted successfully.",
        submission,
      });
    }

    // -----------------------------------------
    // 9. Create new submission
    // -----------------------------------------
    const submission =
      await prisma.submission.create({
        data: {
          assignmentId: assignment.id,
          studentId: user.studentId,
          fileName: fileName.trim(),
          filePath,
          status: "Submitted",
        },
      });

    // -----------------------------------------
    // 10. Return result
    // -----------------------------------------
    return NextResponse.json(
      {
        success: true,
        message:
          "Assignment submitted successfully.",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "SUBMIT ASSIGNMENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to submit assignment.",
      },
      { status: 500 }
    );
  }
}