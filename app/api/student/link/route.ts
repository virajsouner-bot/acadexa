import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const studentId = Number(body.studentId);

    if (!Number.isInteger(studentId)) {
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

    const existingUser = await prisma.user.findUnique({
      where: {
        studentId,
      },
    });

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json(
        {
          error:
            "This student record is already linked to another account.",
        },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        studentId,
      },
    });

    return NextResponse.json({
      message: "Student account linked successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
      },
    });
  } catch (error) {
    console.error("STUDENT LINK ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to link student account.",
      },
      { status: 500 }
    );
  }
}