import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email } = await request.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        {
          message: {
            developerMessage:
              "Signup: First name, last name, and email are required",
            clientMessage:
              "Your first name, last name, and email are required to signup.",
          },
        },
        { status: 400 },
      );
    }

    const user = await xata.db.Users.create({
      firstName,
      lastName,
      email,
    });

    if (!user) {
      return NextResponse.json(
        {
          message: {
            developerMessage: "Signup: Unable to create user",
            clientMessage: "Could not create user. Please try again.",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: {
          developerMessage: "Signup: Created user",
          clientMessage: "",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Signup", error);

    if (error instanceof Error) {
      if (error.message.includes("is not unique")) {
        return NextResponse.json(
          {
            message: {
              developerMessage: "Signup: Email already exists",
              clientMessage: "This email already exists. Try logging in.",
            },
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        message: {
          developerMessage: "Signup: Internal server error",
          clientMessage: "An error has occurred on our end. Sorry!",
        },
      },
      { status: 500 },
    );
  }
}
