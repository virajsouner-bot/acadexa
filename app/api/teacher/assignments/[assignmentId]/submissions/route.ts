import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    assignmentId: string;
  }>;
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

    const { assignmentId } =
      await context.params;

    const id = Number(assignmentId);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid assignment ID." },
        { status: 400 }
      );
    }

    const assignment =
      await prisma.assignment.findUnique({
        where: {
          id,
        },
      });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found." },
        { status: 404 }
      );
    }

    const submissions =
      await prisma.submission.findMany({
        where: {
          assignmentId: id,
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
      assignment,
      submissions,
    });
  } catch (error) {
    console.error(
      "TEACHER SUBMISSIONS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load student submissions.",
      },
      { status: 500 }
    );
  }
}