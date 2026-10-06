import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await requireRole(["ADMIN"]);

    if (!auth.user) {
      return NextResponse.json(
        {
          error: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    if (!auth.authorized) {
      return NextResponse.json(
        {
          error: `Access denied. Current role: ${auth.user.role}`,
        },
        { status: 403 }
      );
    }

    const [
      students,
      courses,
      attendance,
      fees,
      marks,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.course.count(),
      prisma.attendance.count(),
      prisma.fee.count(),
      prisma.mark.count(),
    ]);

    return NextResponse.json({
      students,
      courses,
      attendance,
      fees,
      marks,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard.",
      },
      { status: 500 }
    );
  }
}