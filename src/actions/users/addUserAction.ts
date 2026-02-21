"use server";

import { db } from "@/db/drizzle";
import { users as UsersTable } from "@/db/schema";
import { getUser } from "./getUserAction";

export const addUser = async (
  firstName: string,
  lastName: string,
  email: string,
) => {
  try {
    const user = await getUser(email);

    if (user.status == "failed") {
      const createUser = await db
        .insert(UsersTable)
        .values({ firstName: firstName, lastName: lastName, email: email })
        .returning();

      if (createUser.length < 1) {
        return {
          status: "failed",
          message: "Error adding user to database",
          clientMessage: "There was an error signing up, please try again.",
        };
      }
      if (createUser.length == 1 && createUser[0].id > 0) {
        return {
          status: "success",
          message: "Added user to database.",
          clientMessage: "Added user to database successfully.",
          user: JSON.stringify(createUser[0]),
        };
      }
      return {
        status: "failed",
        message: "Error adding user to database; there is more than one user.",
        clientMessage: "This email already exists, please login.",
      };
    }
  } catch (error) {
    console.error("addUser", error);
    return {
      status: "failed",
      message: "Error adding user to database",
      clientMessage: "There was an error signing up, please try again.",
    };
  }
};
