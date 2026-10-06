import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.update({
      where: {
        email: "admin@studenthub.com",
      },
      data: {
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account role changed to ADMIN.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("FIX ADMIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not change account role.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
