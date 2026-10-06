import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("COURSES ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load courses.",
      },
      {
        status: 500,
      }
    );
  }
}