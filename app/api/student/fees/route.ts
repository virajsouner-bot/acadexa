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

    const fees = await prisma.fee.findMany({
      where: {
        studentId: user.studentId,
      },
      orderBy: {
        dueDate: "desc",
      },
    });

    const totalAmount = fees.reduce(
      (sum, fee) => sum + fee.amount,
      0
    );

    const totalPaid = fees.reduce(
      (sum, fee) => sum + fee.paidAmount,
      0
    );

    const totalPending = totalAmount - totalPaid;

    return NextResponse.json({
      success: true,
      fees,
      summary: {
        totalAmount,
        totalPaid,
        totalPending,
        totalRecords: fees.length,
      },
    });
  } catch (error) {
    console.error("STUDENT FEES ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load fee details.",
      },
      { status: 500 }
    );
  }
}