"use server";

import { db } from "@/db/drizzle";
import { users as UsersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "./getUserAction";

export const updateUser = async (
  firstName: string,
  lastName: string,
  email: string,
) => {
  try {
    const user = await getUser(email);

    if (user.status == "success" && user.user) {
      const selectedUser: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: Date;
      } = JSON.parse(user.user);

      const updateUser = await db
        .update(UsersTable)
        .set({
          firstName,
          lastName,
          email,
        })
        .where(eq(UsersTable.id, selectedUser.id))
        .returning();

      if (updateUser.length < 1) {
        return {
          status: "failed",
          message: "Error updating user in database",
          clientMessage:
            "There was an error updating the user, please try again.",
        };
      }

      if (updateUser.length == 1 && updateUser[0].id > 0) {
        return {
          status: "success",
          message: "Updated user in database.",
          clientMessage: "Updated user in database successfully.",
          user: JSON.stringify(updateUser[0]),
        };
      }
			
      return {
        status: "failed",
        message:
          "Error updating user in database; there is more than one user.",
        clientMessage:
          "There was an error updating the user, please try again.",
      };
    }
  } catch (error) {
    console.log("updateUser", error);
    return {
      status: "failed",
      message: "Error updating user.",
      clientMessage: "There was an error updating the user.",
    };
  }
};
