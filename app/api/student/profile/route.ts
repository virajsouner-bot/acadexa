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

    const student = await prisma.student.findUnique({
      where: {
        id: user.studentId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        rollNumber: true,
        course: true,
        department: true,
        semester: true,
        address: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("STUDENT PROFILE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load student profile.",
      },
      { status: 500 }
    );
  }
}