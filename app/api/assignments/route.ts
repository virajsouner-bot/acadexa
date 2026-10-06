import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { authorized, user } = await requireRole([
      "ADMIN",
      "TEACHER",
      "STUDENT",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const courseIdParam = searchParams.get("courseId");

    if (!courseIdParam) {
      return NextResponse.json(
        { error: "courseId is required." },
        { status: 400 }
      );
    }

    const courseId = Number(courseIdParam);

    if (Number.isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid courseId." },
        { status: 400 }
      );
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        courseId,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("ASSIGNMENTS GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load assignments." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { authorized, user } = await requireRole([
      "ADMIN",
      "TEACHER",
    ]);

    if (!authorized || !user) {
      return NextResponse.json(
        { error: "You do not have permission to create assignments." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const title = body.title?.trim();
    const description = body.description?.trim() || null;
    const courseId = Number(body.courseId);
    const maxMarks = Number(body.maxMarks);
    const dueDate = new Date(body.dueDate);

    if (!title) {
      return NextResponse.json(
        { error: "Assignment title is required." },
        { status: 400 }
      );
    }

    if (!courseId || Number.isNaN(courseId)) {
      return NextResponse.json(
        { error: "Valid courseId is required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { error: "Valid due date is required." },
        { status: 400 }
      );
    }

    if (!maxMarks || maxMarks <= 0) {
      return NextResponse.json(
        { error: "Maximum marks must be greater than 0." },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        courseId,
        maxMarks,
        dueDate,
      },
    });

    return NextResponse.json(
      {
        message: "Assignment created successfully.",
        assignment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ASSIGNMENT POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create assignment." },
      { status: 500 }
    );
  }
}