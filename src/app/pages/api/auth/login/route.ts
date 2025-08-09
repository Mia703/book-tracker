import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          message: "Login: Email is required",
        },
        { status: 400 },
      );
    }

    const user = await xata.db.Users.filter({ email }).getFirst();

    if (!user) {
      return NextResponse.json(
        {
          message: "Login: Email does not exist in database.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: { message: "Login successful", user: JSON.stringify(user) },
      },

      { status: 200 },
    );
  } catch (error) {
    console.error("Login Error", error);
    return NextResponse.json(
      {
        message: "Login: Internal server error",
      },
      { status: 500 },
    );
  }

  
}
