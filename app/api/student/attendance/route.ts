import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    // User is not logged in
    if (!user) {
      return NextResponse.json(
        {
          error: "Not authenticated.",
        },
        {
          status: 401,
        }
      );
    }

    // Only students can access this API
    if (user.role !== "STUDENT") {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        {
          status: 403,
        }
      );
    }

    // Student account is not linked to a Student record
    if (!user.studentId) {
      return NextResponse.json(
        {
          error: "Student account is not linked to a student record.",
        },
        {
          status: 404,
        }
      );
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: user.studentId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Student attendance error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch attendance.",
      },
      {
        status: 500,
      }
    );
  }
}