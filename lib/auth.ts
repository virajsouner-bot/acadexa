import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not defined in .env");
}

const secretKey = new TextEncoder().encode(secret);

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  studentId: number | null;
};

export async function createToken(user: AuthUser) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    studentId: user.studentId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      secretKey
    );

    if (!payload.id) {
      return null;
    }

    return {
      id: Number(payload.id),
      email: String(payload.email || ""),
    };
  } catch (error) {
    console.error("TOKEN VERIFICATION ERROR:", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      console.log("AUTH: No auth-token cookie found.");
      return null;
    }

    const tokenUser = await verifyToken(token);

    if (!tokenUser) {
      console.log("AUTH: Invalid token.");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: tokenUser.id,
      },
    });

    if (!user) {
      console.log("AUTH: User not found.");
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toUpperCase(),
      studentId: user.studentId,
    };
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);
    return null;
  }
}

export async function requireRole(
  allowedRoles: string[]
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      user: null,
    };
  }

  const allowed = allowedRoles.map((role) =>
    role.toUpperCase()
  );

  return {
    authorized: allowed.includes(user.role),
    user,
  };
}