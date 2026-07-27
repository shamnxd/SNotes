import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { registerSchema } from "@/lib/validations";
import { signJwtToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { HTTP_STATUS } from "@/lib/constants/statusCodes";
import { MESSAGES } from "@/lib/constants/messages";
import { successResult, errorResult, buildResponse } from "@/lib/types/api";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return buildResponse(
        errorResult(MESSAGES.COMMON.VALIDATION_ERROR),
        HTTP_STATUS.BAD_REQUEST,
        { details: validation.error.format() }
      );
    }

    const { name, email, password } = validation.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return buildResponse(
        errorResult(MESSAGES.AUTH.EMAIL_EXISTS),
        HTTP_STATUS.CONFLICT
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = signJwtToken({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    const userData = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
    };

    const response = buildResponse(
      successResult(userData, MESSAGES.AUTH.REGISTER_SUCCESS),
      HTTP_STATUS.CREATED
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
