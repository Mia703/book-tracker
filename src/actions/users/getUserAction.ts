"use server";

import { db } from "@/db/drizzle";
import { users as UsersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUser = async (email: string) => {
  try {
    const users = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email));

    const user = users[0];

    if (user && user.id) {
      return {
        status: "success",
        message: "Got user from database.",
        user: JSON.stringify(user),
      };
    }
    return {
      status: "failed",
      message: "Error getting user from database; user does not exist.",
      clientMessage: "There was an error logging in, please try again.",
    };
  } catch (error) {
    console.error("getUser error:", error);
    return {
      status: "failed",
      message: "Error getting user from the database.",
      clientMessage: "There was an error logging in, please try again.",
    };
  }
};
