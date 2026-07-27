import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getAuthUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Note from "@/models/Note";
import Share from "@/models/Share";
import { shareConfigSchema } from "@/lib/validations";
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
    const body = await req.json();
    const validation = shareConfigSchema.safeParse(body);

    if (!validation.success) {
      return buildResponse(
        errorResult(MESSAGES.COMMON.VALIDATION_ERROR),
        HTTP_STATUS.BAD_REQUEST,
        { details: validation.error.format() }
      );
    }

    const { isPasswordProtected, password, isOneTime, expiresAt } = validation.data;

    await connectToDatabase();

    const note = await Note.findOne({ _id: id, userId: authUser.userId });
    if (!note) {
      return buildResponse(
        errorResult(MESSAGES.NOTE.NOT_FOUND),
        HTTP_STATUS.NOT_FOUND
      );
    }

    let passwordHash: string | undefined = undefined;
    if (isPasswordProtected) {
      if (!password || password.trim().length === 0) {
        return buildResponse(
          errorResult(MESSAGES.SHARE.PASSWORD_REQUIRED_ERR),
          HTTP_STATUS.BAD_REQUEST
        );
      }
      passwordHash = await bcrypt.hash(password, 10);
    }

    let existingShare = await Share.findOne({ noteId: note._id });

    if (existingShare) {
      existingShare.isPasswordProtected = isPasswordProtected;
      if (passwordHash) {
        existingShare.passwordHash = passwordHash;
      } else if (!isPasswordProtected) {
        existingShare.passwordHash = undefined;
      }
      existingShare.isOneTime = isOneTime;
      existingShare.isRevoked = false;
      existingShare.expiresAt = expiresAt ? new Date(expiresAt) : undefined;
      await existingShare.save();
    } else {
      const token = crypto.randomBytes(16).toString("hex");
      existingShare = await Share.create({
        noteId: note._id,
        userId: authUser.userId,
        token,
        isPasswordProtected,
        passwordHash,
        isOneTime,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      });
    }

    const shareData = {
      id: existingShare._id.toString(),
      token: existingShare.token,
      shareUrl: `/share/${existingShare.token}`,
      isPasswordProtected: existingShare.isPasswordProtected,
      isOneTime: existingShare.isOneTime,
      isUsed: existingShare.isUsed,
      expiresAt: existingShare.expiresAt,
      isRevoked: existingShare.isRevoked,
      viewCount: existingShare.viewCount,
    };

    return buildResponse(
      successResult(shareData, MESSAGES.SHARE.GENERATED_SUCCESS),
      HTTP_STATUS.OK
    );
  } catch (error) {
    console.error("Generate Share Link Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
