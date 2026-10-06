import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
    submissionId: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    // --------------------------------------------------
    // CHECK TEACHER / ADMIN ACCESS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // GET IDS
    // --------------------------------------------------

    const { id, submissionId } = await context.params;

    const assignmentId = Number(id);
    const submissionIdNumber = Number(submissionId);

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

    if (
      !Number.isInteger(submissionIdNumber) ||
      submissionIdNumber <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid submission ID.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // READ REQUEST BODY
    // --------------------------------------------------

    const body = await request.json();

    const marks = body.marks;
    const feedback = body.feedback;

    // --------------------------------------------------
    // FIND ASSIGNMENT
    // --------------------------------------------------

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

    // --------------------------------------------------
    // VALIDATE MARKS
    // --------------------------------------------------

    if (
      marks === undefined ||
      marks === null ||
      marks === ""
    ) {
      return NextResponse.json(
        {
          error: "Marks are required.",
        },
        { status: 400 }
      );
    }

    const numericMarks = Number(marks);

    if (!Number.isFinite(numericMarks)) {
      return NextResponse.json(
        {
          error: "Marks must be a valid number.",
        },
        { status: 400 }
      );
    }

    if (numericMarks < 0) {
      return NextResponse.json(
        {
          error: "Marks cannot be negative.",
        },
        { status: 400 }
      );
    }

    if (numericMarks > assignment.maxMarks) {
      return NextResponse.json(
        {
          error: `Marks cannot be greater than ${assignment.maxMarks}.`,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // FIND SUBMISSION
    // --------------------------------------------------

    const submission =
      await prisma.submission.findUnique({
        where: {
          id: submissionIdNumber,
        },
      });

    if (!submission) {
      return NextResponse.json(
        {
          error: "Submission not found.",
        },
        { status: 404 }
      );
    }

    // Make sure this submission belongs
    // to the assignment in the URL.

    if (submission.assignmentId !== assignmentId) {
      return NextResponse.json(
        {
          error:
            "This submission does not belong to this assignment.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // SAVE GRADE
    // --------------------------------------------------

    const updatedSubmission =
      await prisma.submission.update({
        where: {
          id: submissionIdNumber,
        },

        data: {
          marks: numericMarks,

          feedback:
            feedback === undefined ||
            feedback === null
              ? null
              : String(feedback).trim(),

          status: "Graded",
        },

        select: {
          id: true,
          marks: true,
          feedback: true,
          status: true,
          submittedAt: true,
          fileName: true,
          filePath: true,
          studentId: true,
          assignmentId: true,
        },
      });

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      message: "Grade saved successfully.",

      submission: updatedSubmission,
    });
  } catch (error) {
    console.error(
      "GRADE SUBMISSION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to save grade.",
      },
      { status: 500 }
    );
  }
}