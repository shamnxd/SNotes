import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { HTTP_STATUS } from "@/lib/constants/statusCodes";
import { MESSAGES } from "@/lib/constants/messages";
import { successResult, buildResponse } from "@/lib/types/api";

export async function POST() {
  const response = buildResponse(
    successResult(null, MESSAGES.AUTH.LOGOUT_SUCCESS),
    HTTP_STATUS.OK
  );

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
