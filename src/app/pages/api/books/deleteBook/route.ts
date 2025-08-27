import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { xataID } = await request.json();

    if (!xataID) {
      return NextResponse.json(
        {
          message: {
            message: "deleteBook: Xata ID is required",
            type: "error",
          },
        },
        { status: 404 },
      );
    }

    const deleteBook = await xata.db.Books.delete(xataID);

    if (!deleteBook) {
      return NextResponse.json(
        {
          message: {
            message: "deleteBook: Could not delete book",
            type: "error",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: { message: "deleteBook: Deleted book", type: "delete" } },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: { message: "Internal server error.", type: "error" } },
      { status: 500 },
    );
  }
}
