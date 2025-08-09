import { NextResponse } from "next/server";

export async function POST (request: Request) {
	try {
		return NextResponse.json(
			{ message: "Success" },
			{ status: 200 },
		);
	}
	catch (error) {
		console.log("Error", error);
		return NextResponse.json(
			{ message: "Internal server error." },
			{ status: 500 },
		);
	}
}