import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import Share from "@/models/Share";
import Note from "@/models/Note";
import { HTTP_STATUS, SHARE_STATUS } from "@/lib/constants/statusCodes";
import { MESSAGES } from "@/lib/constants/messages";
import { successResult, errorResult, buildResponse } from "@/lib/types/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    await connectToDatabase();

    const share = await Share.findOne({ token });
    if (!share) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_INVALID),
        HTTP_STATUS.NOT_FOUND,
        { status: SHARE_STATUS.INVALID }
      );
    }

    if (share.isRevoked) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_REVOKED),
        HTTP_STATUS.GONE,
        { status: SHARE_STATUS.REVOKED }
      );
    }

    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_EXPIRED),
        HTTP_STATUS.GONE,
        { status: SHARE_STATUS.EXPIRED }
      );
    }

    if (share.isOneTime && share.isUsed) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_USED),
        HTTP_STATUS.GONE,
        { status: SHARE_STATUS.USED }
      );
    }

    if (share.isPasswordProtected) {
      return buildResponse(
        successResult({ isPasswordProtected: true }, "Password authentication required"),
        HTTP_STATUS.OK,
        { status: SHARE_STATUS.PASSWORD_REQUIRED }
      );
    }

    const updatedShare = await Share.findOneAndUpdate(
      {
        _id: share._id,
        isRevoked: false,
        isUsed: false,
      },
      {
        $inc: { viewCount: 1 },
        ...(share.isOneTime ? { $set: { isUsed: true } } : {}),
      },
      { new: true }
    );

    if (!updatedShare) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_USED),
        HTTP_STATUS.GONE,
        { status: SHARE_STATUS.USED }
      );
    }

    const note = await Note.findById(share.noteId);
    if (!note) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.NOTE_DELETED),
        HTTP_STATUS.NOT_FOUND,
        { status: SHARE_STATUS.NOT_FOUND }
      );
    }

    const accessData = {
      note: {
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
      },
      shareInfo: {
        isOneTime: share.isOneTime,
        viewCount: updatedShare.viewCount,
      },
    };

    return buildResponse(
      successResult(accessData, MESSAGES.SHARE.ACCESS_SUCCESS),
      HTTP_STATUS.OK,
      { status: SHARE_STATUS.SUCCESS }
    );
  } catch (error) {
    console.error("Access Share Link GET Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { password } = await req.json();

    await connectToDatabase();

    const share = await Share.findOne({ token });
    if (!share) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_INVALID),
        HTTP_STATUS.NOT_FOUND,
        { status: SHARE_STATUS.INVALID }
      );
    }

    if (share.isRevoked) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_REVOKED),
        HTTP_STATUS.GONE,
        { status: SHARE_STATUS.REVOKED }
      );
    }

    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_EXPIRED),
        HTTP_STATUS.GONE,
        { status: SHARE_STATUS.EXPIRED }
      );
    }

    if (share.isOneTime && share.isUsed) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_USED),
        HTTP_STATUS.GONE,
        { status: SHARE_STATUS.USED }
      );
    }

    if (share.isPasswordProtected) {
      if (!password) {
        return buildResponse(
          errorResult(MESSAGES.SHARE.PASSWORD_REQUIRED_ERR),
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const isMatch = await bcrypt.compare(password, share.passwordHash || "");
      if (!isMatch) {
        return buildResponse(
          errorResult(MESSAGES.SHARE.PASSWORD_INCORRECT),
          HTTP_STATUS.UNAUTHORIZED
        );
      }
    }

    const updatedShare = await Share.findOneAndUpdate(
      {
        _id: share._id,
        isRevoked: false,
        isUsed: false,
      },
      {
        $inc: { viewCount: 1 },
        ...(share.isOneTime ? { $set: { isUsed: true } } : {}),
      },
      { new: true }
    );

    if (!updatedShare) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.LINK_USED),
        HTTP_STATUS.GONE,
        { status: SHARE_STATUS.USED }
      );
    }

    const note = await Note.findById(share.noteId);
    if (!note) {
      return buildResponse(
        errorResult(MESSAGES.SHARE.NOTE_DELETED),
        HTTP_STATUS.NOT_FOUND,
        { status: SHARE_STATUS.NOT_FOUND }
      );
    }

    const accessData = {
      note: {
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
      },
      shareInfo: {
        isOneTime: share.isOneTime,
        viewCount: updatedShare.viewCount,
      },
    };

    return buildResponse(
      successResult(accessData, MESSAGES.SHARE.ACCESS_SUCCESS),
      HTTP_STATUS.OK,
      { status: SHARE_STATUS.SUCCESS }
    );
  } catch (error) {
    console.error("Access Share Link POST Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
