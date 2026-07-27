import { getAuthUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Note from "@/models/Note";
import Share from "@/models/Share";
import { HTTP_STATUS } from "@/lib/constants/statusCodes";
import { MESSAGES } from "@/lib/constants/messages";
import { successResult, errorResult, buildResponse } from "@/lib/types/api";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return buildResponse(
        errorResult(MESSAGES.AUTH.UNAUTHORIZED),
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const { id } = await params;

    await connectToDatabase();

    const note = await Note.findOne({ _id: id, userId: authUser.userId });
    if (!note) {
      return buildResponse(
        errorResult(MESSAGES.NOTE.NOT_FOUND),
        HTTP_STATUS.NOT_FOUND
      );
    }

    const share = await Share.findOne({ noteId: note._id });
    if (!share) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.NO_ACTIVE_LINK),
        HTTP_STATUS.NOT_FOUND
      );
    }

    share.isRevoked = true;
    await share.save();

    const shareData = {
      id: share._id.toString(),
      token: share.token,
      isRevoked: true,
    };

    return buildResponse(
      successResult(shareData, MESSAGES.SHARE.REVOKED_SUCCESS),
      HTTP_STATUS.OK
    );
  } catch (error) {
    console.error("Revoke Share Link Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
