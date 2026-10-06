import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { authorized } = await requireRole(["ADMIN"]);

    if (!authorized) {
      return NextResponse.json(
        { error: "Only admins can delete enrollments." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const enrollmentId = Number(id);

    if (!Number.isInteger(enrollmentId)) {
      return NextResponse.json(
        { error: "Invalid enrollment ID." },
        { status: 400 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found." },
        { status: 404 }
      );
    }

    await prisma.enrollment.delete({
      where: {
        id: enrollmentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Enrollment deleted successfully.",
    });
  } catch (error) {
    console.error("ENROLLMENT DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete enrollment." },
      { status: 500 }
    );
  }
}
