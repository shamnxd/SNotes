import { NextResponse } from "next/server";
import { HTTP_STATUS, HttpStatusCode } from "../constants/statusCodes";

// Generic API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Discriminated Union Result Type
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

// Result Helper Builders
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

// Helper to convert Result<T> directly into a standardized NextResponse<ApiResponse<T>>
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
