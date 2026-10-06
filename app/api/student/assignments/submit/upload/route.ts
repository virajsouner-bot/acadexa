import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    // -----------------------------------------
    // 1. Check login
    // -----------------------------------------
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Please login first.",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // 2. Check student account
    // -----------------------------------------
    if (!user.studentId) {
      return NextResponse.json(
        {
          error:
            "Your account is not linked to a student record.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 3. Get assignment ID
    // -----------------------------------------
    const { id } = await context.params;

    const assignmentId = Number(id);

    if (
      !Number.isInteger(assignmentId) ||
      assignmentId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid assignment ID.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 4. Check assignment
    // -----------------------------------------
    const assignment =
      await prisma.assignment.findUnique({
        where: {
          id: assignmentId,
        },
      });

    if (!assignment) {
      return NextResponse.json(
        {
          error: "Assignment not found.",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // 5. Check enrollment
    // -----------------------------------------
    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.studentId,
            courseId: assignment.courseId,
          },
        },
      });

    if (!enrollment) {
      return NextResponse.json(
        {
          error:
            "You are not enrolled in this course.",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // 6. Read uploaded file
    // -----------------------------------------
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Please select a file.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 7. Check file size
    // Maximum: 10 MB
    // -----------------------------------------
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File size must be 10 MB or less.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 8. Allowed file types
    // -----------------------------------------
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "File type not supported. Upload PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, JPG or PNG.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 9. Create upload directory
    // -----------------------------------------
    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "assignments"
    );

    await fs.mkdir(uploadDirectory, {
      recursive: true,
    });

    // -----------------------------------------
    // 10. Create safe unique filename
    // -----------------------------------------
    const originalName = file.name;

    const extension = path.extname(originalName);

    const safeFileName =
      `assignment-${assignmentId}-student-${user.studentId}-${Date.now()}${extension}`;

    const filePath = path.join(
      uploadDirectory,
      safeFileName
    );

    // -----------------------------------------
    // 11. Save file
    // -----------------------------------------
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    // -----------------------------------------
    // 12. Public file URL
    // -----------------------------------------
    const publicPath =
      `/uploads/assignments/${safeFileName}`;

    // -----------------------------------------
    // 13. Save submission in database
    // -----------------------------------------
    const existingSubmission =
      await prisma.submission.findUnique({
        where: {
          assignmentId_studentId: {
            assignmentId,
            studentId: user.studentId,
          },
        },
      });

    let submission;

    if (existingSubmission) {
      submission = await prisma.submission.update({
        where: {
          id: existingSubmission.id,
        },
        data: {
          fileName: originalName,
          filePath: publicPath,
          submittedAt: new Date(),
          status: "Resubmitted",
        },
      });
    } else {
      submission = await prisma.submission.create({
        data: {
          assignmentId,
          studentId: user.studentId,
          fileName: originalName,
          filePath: publicPath,
          submittedAt: new Date(),
          status: "Submitted",
        },
      });
    }

    // -----------------------------------------
    // 14. Return success
    // -----------------------------------------
    return NextResponse.json(
      {
        success: true,
        message:
          existingSubmission
            ? "Assignment resubmitted successfully."
            : "Assignment submitted successfully.",

        submission: {
          id: submission.id,
          fileName: submission.fileName,
          filePath: submission.filePath,
          submittedAt: submission.submittedAt,
          status: submission.status,
        },
      },
      { status: existingSubmission ? 200 : 201 }
    );
  } catch (error) {
    console.error(
      "ASSIGNMENT FILE UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to upload assignment file.",
      },
      { status: 500 }
    );
  }
}