import { NextResponse } from "next/server";
import { HTTP_STATUS, HttpStatusCode } from "../constants/statusCodes";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export type Result<T> =
  | {
        success: true;
        data: T;
        message?: string;
    }
  | {
        success: false;
        message: string;
    };

export function successResult<T>(data: T, message: string = "Success"): Result<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResult<T = never>(message: string): Result<T> {
  return {
    success: false,
    message,
  };
}

export function buildResponse<T>(
  result: Result<T>,
  status?: HttpStatusCode,
  extraMeta?: Record<string, any>
): NextResponse<ApiResponse<T | null>> {
  if (result.success) {
    const httpStatus = status || HTTP_STATUS.OK;
    return NextResponse.json(
      {
        success: true,
        message: result.message || "Operation completed successfully",
        data: result.data,
        ...extraMeta,
      },
      { status: httpStatus }
    );
  }

  const httpStatus = status || HTTP_STATUS.BAD_REQUEST;
  return NextResponse.json(
    {
      success: false,
      message: result.message,
      data: null,
      ...extraMeta,
    },
    { status: httpStatus }
  );
}
