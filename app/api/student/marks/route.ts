import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please login first." },
        { status: 401 }
      );
    }

    if (!user.studentId) {
      return NextResponse.json(
        {
          error:
            "Your account is not linked to a student record.",
        },
        { status: 400 }
      );
    }

    const marks = await prisma.mark.findMany({
      where: {
        studentId: user.studentId,
      },
      orderBy: {
        subject: "asc",
      },
    });

    const totalMarks = marks.reduce(
      (sum, mark) => sum + mark.marks,
      0
    );

    const totalMaxMarks = marks.reduce(
      (sum, mark) => sum + mark.maxMarks,
      0
    );

    const percentage =
      totalMaxMarks > 0
        ? Math.round(
            (totalMarks / totalMaxMarks) * 100
          )
        : 0;

    return NextResponse.json({
      success: true,
      marks,
      summary: {
        subjects: marks.length,
        totalMarks,
        totalMaxMarks,
        percentage,
      },
    });
  } catch (error) {
    console.error("STUDENT MARKS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load marks.",
      },
      { status: 500 }
    );
  }
}