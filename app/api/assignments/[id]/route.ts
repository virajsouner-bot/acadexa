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
      "STUDENT",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const assignmentId = Number(id);

    if (Number.isNaN(assignmentId)) {
      return NextResponse.json(
        { error: "Invalid assignment ID." },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found." },
        { status: 404 }
      );
    }

    // STUDENT → return only their own submission
    if (user.role === "STUDENT") {
      if (!user.studentId) {
        return NextResponse.json(
          {
            ...assignment,
            submission: null,
          },
          { status: 200 }
        );
      }

      const submission = await prisma.submission.findUnique({
        where: {
          assignmentId_studentId: {
            assignmentId,
            studentId: user.studentId,
          },
        },
      });

      return NextResponse.json({
        ...assignment,
        submission,
      });
    }

    // ADMIN / TEACHER → return all submissions
    const submissions = await prisma.submission.findMany({
      where: {
        assignmentId,
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            rollNumber: true,
            email: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return NextResponse.json({
      ...assignment,
      submissions,
    });
  } catch (error) {
    console.error("ASSIGNMENT GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load assignment." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { authorized } = await requireRole([
      "ADMIN",
      "TEACHER",
    ]);

    if (!authorized) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const assignmentId = Number(id);

    if (Number.isNaN(assignmentId)) {
      return NextResponse.json(
        { error: "Invalid assignment ID." },
        { status: 400 }
      );
    }

    await prisma.assignment.delete({
      where: {
        id: assignmentId,
      },
    });

    return NextResponse.json({
      message: "Assignment deleted successfully.",
    });
  } catch (error) {
    console.error("ASSIGNMENT DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete assignment." },
      { status: 500 }
    );
  }
}