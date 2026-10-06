import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    submissionId: string;
  }>;
};

export async function PATCH(
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

    const { submissionId } =
      await context.params;

    const id = Number(submissionId);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid submission ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const marks = Number(body.marks);
    const feedback =
      body.feedback?.trim() || null;

    if (Number.isNaN(marks)) {
      return NextResponse.json(
        { error: "Valid marks are required." },
        { status: 400 }
      );
    }

    const submission =
      await prisma.submission.findUnique({
        where: {
          id,
        },
        include: {
          assignment: true,
        },
      });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found." },
        { status: 404 }
      );
    }

    if (marks < 0) {
      return NextResponse.json(
        { error: "Marks cannot be negative." },
        { status: 400 }
      );
    }

    if (marks > submission.assignment.maxMarks) {
      return NextResponse.json(
        {
          error: `Marks cannot be greater than ${submission.assignment.maxMarks}.`,
        },
        { status: 400 }
      );
    }

    const updatedSubmission =
      await prisma.submission.update({
        where: {
          id,
        },
        data: {
          marks,
          feedback,
          status: "Graded",
        },
      });

    return NextResponse.json({
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