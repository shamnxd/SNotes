import { getAuthUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { HTTP_STATUS } from "@/lib/constants/statusCodes";
import { MESSAGES } from "@/lib/constants/messages";
import { successResult, errorResult, buildResponse } from "@/lib/types/api";

export async function GET(req: Request) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return buildResponse(
        errorResult(MESSAGES.AUTH.UNAUTHORIZED),
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await connectToDatabase();
    const user = await User.findById(authUser.userId).select("-password");
    if (!user) {
      return buildResponse(
        errorResult(MESSAGES.AUTH.USER_NOT_FOUND),
        HTTP_STATUS.NOT_FOUND
      );
    }

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return buildResponse(
      successResult(userData, "User profile fetched successfully"),
      HTTP_STATUS.OK
    );
  } catch (error) {
    console.error("Auth Me Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
