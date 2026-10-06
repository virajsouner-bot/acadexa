import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const { authorized, user } = await requireRole([
      "ADMIN",
      "TEACHER",
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    if (!authorized) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
      );
    }

    const teachers = await prisma.teacher.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("TEACHERS GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load teachers." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { authorized, user } = await requireRole([
      "ADMIN",
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    if (!authorized) {
      return NextResponse.json(
        { error: "Only admins can add teachers." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim() || null;
    const department = body.department?.trim();
    const designation =
      body.designation?.trim() || null;
    const employeeId = body.employeeId?.trim();

    if (
      !fullName ||
      !email ||
      !department ||
      !employeeId
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email, department and employee ID are required.",
        },
        { status: 400 }
      );
    }

    const existingEmail =
      await prisma.teacher.findUnique({
        where: {
          email,
        },
      });

    if (existingEmail) {
      return NextResponse.json(
        {
          error:
            "A teacher with this email already exists.",
        },
        { status: 409 }
      );
    }

    const existingEmployee =
      await prisma.teacher.findUnique({
        where: {
          employeeId,
        },
      });

    if (existingEmployee) {
      return NextResponse.json(
        {
          error:
            "A teacher with this employee ID already exists.",
        },
        { status: 409 }
      );
    }

    const teacher = await prisma.teacher.create({
      data: {
        fullName,
        email,
        phone,
        department,
        designation,
        employeeId,
      },
    });

    return NextResponse.json(
      teacher,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "TEACHER CREATE ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Failed to create teacher." },
      { status: 500 }
    );
  }
}