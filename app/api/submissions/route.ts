import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { authorized, user } = await requireRole([
      "STUDENT",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        { error: "Only students can submit assignments." },
        { status: 403 }
      );
    }

    if (!user.studentId) {
      return NextResponse.json(
        { error: "Your account is not linked to a student profile." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const assignmentId = Number(body.assignmentId);
    const fileName = body.fileName?.trim();
    const filePath = body.filePath?.trim() || null;

    if (!assignmentId || Number.isNaN(assignmentId)) {
      return NextResponse.json(
        { error: "Valid assignment ID is required." },
        { status: 400 }
      );
    }

    if (!fileName) {
      return NextResponse.json(
        { error: "File name is required." },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found." },
        { status: 404 }
      );
    }

    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: user.studentId,
        },
      },
      update: {
        fileName,
        filePath,
        submittedAt: new Date(),
        status: "Submitted",
      },
      create: {
        assignmentId,
        studentId: user.studentId,
        fileName,
        filePath,
        status: "Submitted",
      },
    });

    return NextResponse.json({
      message: "Assignment submitted successfully.",
      submission,
    });
  } catch (error) {
    console.error("SUBMISSION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to submit assignment." },
      { status: 500 }
    );
  }
}