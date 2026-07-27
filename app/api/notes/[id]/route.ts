import { getAuthUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Note from "@/models/Note";
import Share from "@/models/Share";
import { updateNoteSchema } from "@/lib/validations";
import { HTTP_STATUS } from "@/lib/constants/statusCodes";
import { MESSAGES } from "@/lib/constants/messages";
import { successResult, errorResult, buildResponse } from "@/lib/types/api";

export async function GET(
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

    const noteData = {
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      share: share
        ? {
            id: share._id.toString(),
            token: share.token,
            isPasswordProtected: share.isPasswordProtected,
            isOneTime: share.isOneTime,
            isUsed: share.isUsed,
            expiresAt: share.expiresAt,
            isRevoked: share.isRevoked,
            viewCount: share.viewCount,
          }
        : null,
    };

    return buildResponse(
      successResult(noteData, MESSAGES.NOTE.FETCH_SINGLE_SUCCESS),
      HTTP_STATUS.OK
    );
  } catch (error) {
    console.error("Get Single Note Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

export async function PUT(
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
    const validation = updateNoteSchema.safeParse(body);

    if (!validation.success) {
      return buildResponse(
        errorResult(MESSAGES.COMMON.VALIDATION_ERROR),
        HTTP_STATUS.BAD_REQUEST,
        { details: validation.error.format() }
      );
    }

    await connectToDatabase();

    const note = await Note.findOne({ _id: id, userId: authUser.userId });
    if (!note) {
      return buildResponse(
        errorResult(MESSAGES.NOTE.NOT_FOUND),
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (validation.data.title !== undefined) {
      note.title = validation.data.title;
    }
    if (validation.data.content !== undefined) {
      note.content = validation.data.content;
    }

    await note.save();

    const updatedData = {
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      updatedAt: note.updatedAt,
    };

    return buildResponse(
      successResult(updatedData, MESSAGES.NOTE.UPDATED_SUCCESS),
      HTTP_STATUS.OK
    );
  } catch (error) {
    console.error("Update Note Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

export async function DELETE(
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

    const note = await Note.findOneAndDelete({ _id: id, userId: authUser.userId });
    if (!note) {
      return buildResponse(
        errorResult(MESSAGES.NOTE.NOT_FOUND),
        HTTP_STATUS.NOT_FOUND
      );
    }

    await Share.deleteMany({ noteId: id });

    return buildResponse(
      successResult(null, MESSAGES.NOTE.DELETED_SUCCESS),
      HTTP_STATUS.OK
    );
  } catch (error) {
    console.error("Delete Note Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
