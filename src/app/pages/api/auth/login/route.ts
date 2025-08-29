import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          message: {
            developerMessage: "Login: Email is required",
            clientMessage: "A email is required to login",
          },
        },
        { status: 400 },
      );
    }

    const user = await xata.db.Users.filter({ email }).getFirst();

    if (!user) {
      return NextResponse.json(
        {
          message: {
            developerMessage: "Login: Email does not exist in database.",
            clientMessage: "The inputted email does not exist. Try signing up.",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: {
          developerMessage: "Login: Login successful",
          clientMessage: "",
          user: JSON.stringify(user),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      {
        message: {
          developerMessage: "Login: Internal server error",
          clientMessage: "An error has occurred on our end. Sorry!",
        },
      },
      { status: 500 },
    );
  }
}
