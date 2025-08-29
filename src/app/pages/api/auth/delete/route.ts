import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          message: {
            developerMessage: "Delete: Email is required",
            clientMessage: "Your email is required to delete your account.",
          },
        },
        { status: 400 },
      );
    }

    const getUser = await xata.db.Users.filter({ email }).getFirst();

    if (!getUser) {
      return NextResponse.json(
        {
          message: {
            developerMessage: "Delete: Email does not exist",
            clientMessage: "The inputted email does not exist. Try signing up.",
          },
        },
        { status: 404 },
      );
    }

    const deleteUser = await xata.db.Users.deleteOrThrow(getUser?.xata_id);

    if (!deleteUser) {
      return NextResponse.json(
        {
          message: {
            developerMessage: "Delete: Could not delete user",
            clientMessage:
              "There was an error deleting your account. Please try again.",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: {
          developerMessage: "Delete: Deletion successful",
          clientMessage: "Your account has been deleted",
        },
      },
      { status: 200 },
    );

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
