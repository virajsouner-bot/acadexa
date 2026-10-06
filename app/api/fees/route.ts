import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
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

    const fees = await prisma.fee.findMany({
      include: {
        student: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(fees);
  } catch (error) {
    console.error("Error fetching fees:", error);

    return NextResponse.json(
      { error: "Failed to fetch fees." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const data = await request.json();

    const studentId = Number(data.studentId);
    const amount = Number(data.amount);
    const paidAmount = Number(data.paidAmount || 0);
    const dueDate = data.dueDate;

    if (
      !studentId ||
      Number.isNaN(amount) ||
      amount <= 0 ||
      !dueDate
    ) {
      return NextResponse.json(
        {
          error:
            "Student, amount and due date are required.",
        },
        { status: 400 }
      );
    }

    if (paidAmount < 0 || paidAmount > amount) {
      return NextResponse.json(
        {
          error:
            "Paid amount must be between 0 and the total fee amount.",
        },
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
        {
          error: "Student not found.",
        },
        { status: 404 }
      );
    }

    let status = "Pending";

    if (paidAmount >= amount) {
      status = "Paid";
    } else if (paidAmount > 0) {
      status = "Partial";
    }

    const fee = await prisma.fee.create({
      data: {
        amount,
        paidAmount,
        dueDate,
        status,
        studentId,
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json(fee, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating fee:", error);

    return NextResponse.json(
      { error: "Failed to create fee." },
      { status: 500 }
    );
  }
}