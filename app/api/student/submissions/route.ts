import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const { authorized, user } =
      await requireRole(["STUDENT"]);

    if (!authorized || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    if (!user.studentId) {
      return NextResponse.json(
        {
          error:
            "Your account is not linked to a student profile.",
        },
        { status: 400 }
      );
    }

    const submissions =
      await prisma.submission.findMany({
        where: {
          studentId: user.studentId,
        },
        include: {
          assignment: {
            select: {
              id: true,
              title: true,
              maxMarks: true,
              dueDate: true,
              courseId: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error(
      "STUDENT SUBMISSIONS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load your submissions.",
      },
      { status: 500 }
    );
  }
}