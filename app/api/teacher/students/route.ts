import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const { authorized, user } = await requireRole([
      "TEACHER",
      "ADMIN",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        {
          error: "Teacher or Admin access required.",
        },
        { status: 401 }
      );
    }

    const students = await prisma.student.findMany({
      orderBy: {
        fullName: "asc",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        rollNumber: true,
        course: true,
        department: true,
        semester: true,
        phone: true,
      },
    });

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("TEACHER STUDENTS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load students.",
      },
      { status: 500 }
    );
  }
}