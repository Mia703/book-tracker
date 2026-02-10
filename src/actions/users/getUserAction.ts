"use server";

import { db } from "@/db/drizzle";
import { users as UsersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUser = async (email: string) => {
  try {
    const user = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email));

    if (user[0].id > 0) {
      return {
        status: "success",
        message: "Got user from database.",
        user: JSON.stringify(user[0]),
      };
    } else {
      return {
        status: "failed",
        message: "Error getting user from database; user does not exist.",
        clientMessage: "There was an error logging in, please try again.",
      };
    }
  } catch (error) {
    console.log("getUser", error);
    return {
      status: "failed",
      message: "Error getting user from the database.",
      clientMessage: "There was an error logging in, please try again.",
    };
  }
};
