import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email } = await request.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: "Signup: First name, last name, and email are required" },
        { status: 404 },
      );
    }

    const user = await xata.db.Users.create({
      firstName,
      lastName,
      email,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Signup: Unable to create user" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Signup: Created user" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Signup", error);

    if (error instanceof Error) {
      if (error.message.includes("is not unique")) {
        return NextResponse.json(
          { message: "Signup: Email already exists" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { message: "Signup: Internal server error" },
      { status: 500 },
    );
  }
}
