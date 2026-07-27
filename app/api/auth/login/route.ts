import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { loginSchema } from "@/lib/validations";
import { signJwtToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { HTTP_STATUS } from "@/lib/constants/statusCodes";
import { MESSAGES } from "@/lib/constants/messages";
import { successResult, errorResult, buildResponse } from "@/lib/types/api";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return buildResponse(
        errorResult(MESSAGES.COMMON.VALIDATION_ERROR),
        HTTP_STATUS.BAD_REQUEST,
        { details: validation.error.format() }
      );
    }

    const { email, password } = validation.data;

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return buildResponse(
        errorResult(MESSAGES.AUTH.INVALID_CREDENTIALS),
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return buildResponse(
        errorResult(MESSAGES.AUTH.INVALID_CREDENTIALS),
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const token = signJwtToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    const response = buildResponse(
      successResult(userData, MESSAGES.AUTH.LOGIN_SUCCESS),
      HTTP_STATUS.OK
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
    console.error("Login Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
