import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const auth = await requireRole(["ADMIN"]);

    if (!auth.user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const studentId = Number(id);

    if (Number.isNaN(studentId)) {
      return NextResponse.json(
        { error: "Invalid student ID." },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);

    return NextResponse.json(
      { error: "Failed to fetch student." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const auth = await requireRole(["ADMIN"]);

    if (!auth.user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const studentId = Number(id);

    if (Number.isNaN(studentId)) {
      return NextResponse.json(
        { error: "Invalid student ID." },
        { status: 400 }
      );
    }

    const data = await request.json();

    if (
      !data.fullName ||
      !data.email ||
      !data.rollNumber ||
      !data.course ||
      !data.department ||
      !data.semester
    ) {
      return NextResponse.json(
        {
          error:
            "Full name, email, roll number, course, department and semester are required.",
        },
        { status: 400 }
      );
    }

    const student = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || null,
        rollNumber: data.rollNumber,
        course: data.course,
        department: data.department,
        semester: data.semester,
        address: data.address || null,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating student:", error);

    return NextResponse.json(
      { error: "Failed to update student." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const auth = await requireRole(["ADMIN"]);

    if (!auth.user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const studentId = Number(id);

    if (Number.isNaN(studentId)) {
      return NextResponse.json(
        { error: "Invalid student ID." },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    await prisma.student.delete({
      where: {
        id: studentId,
      },
    });

    return NextResponse.json({
      message: "Student deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting student:", error);

    return NextResponse.json(
      { error: "Failed to delete student." },
      { status: 500 }
    );
  }
}