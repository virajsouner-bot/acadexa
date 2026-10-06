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

    const teacher = await prisma.teacher.findUnique({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        department: true,
        designation: true,
        employeeId: true,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        {
          error:
            "Teacher profile not found. Please create a teacher record first.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("TEACHER PROFILE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load teacher profile.",
      },
      { status: 500 }
    );
  }
}