import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Note from "@/models/Note";
import Share from "@/models/Share";
import { createNoteSchema } from "@/lib/validations";
import { HTTP_STATUS } from "@/lib/constants/statusCodes";
import { MESSAGES } from "@/lib/constants/messages";
import { errorResult, buildResponse } from "@/lib/types/api";

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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const skip = (page - 1) * limit;

    const filter: any = { userId: authUser.userId };
    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const totalNotes = await Note.countDocuments(filter);
    const totalPages = Math.ceil(totalNotes / limit) || 1;

    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const noteIds = notes.map((n) => n._id);
    const shares = await Share.find({ noteId: { $in: noteIds } }).lean();

    const shareMap = new Map();
    shares.forEach((share) => {
      shareMap.set(share.noteId.toString(), {
        id: share._id.toString(),
        token: share.token,
        isPasswordProtected: share.isPasswordProtected,
        isOneTime: share.isOneTime,
        isUsed: share.isUsed,
        expiresAt: share.expiresAt,
        isRevoked: share.isRevoked,
        viewCount: share.viewCount,
      });
    });

    const formattedNotes = notes.map((note) => ({
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      share: shareMap.get(note._id.toString()) || null,
    }));

    return NextResponse.json({
      success: true,
      data: formattedNotes,
      pagination: {
        totalNotes,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Fetch Notes Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return buildResponse(
        errorResult(MESSAGES.AUTH.UNAUTHORIZED),
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const body = await req.json();
    const validation = createNoteSchema.safeParse(body);

    if (!validation.success) {
      return buildResponse(
        errorResult(MESSAGES.COMMON.VALIDATION_ERROR),
        HTTP_STATUS.BAD_REQUEST,
        { details: validation.error.format() }
      );
    }

    const { title, content } = validation.data;

    await connectToDatabase();

    const newNote = await Note.create({
      userId: authUser.userId,
      title,
      content,
    });

    const noteData = {
      id: newNote._id.toString(),
      title: newNote.title,
      content: newNote.content,
      createdAt: newNote.createdAt,
      updatedAt: newNote.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: noteData,
      message: MESSAGES.NOTE.CREATED_SUCCESS,
    });
  } catch (error) {
    console.error("Create Note Error:", error);
    return buildResponse(
      errorResult(MESSAGES.COMMON.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
