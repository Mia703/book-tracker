"use server";

import { db } from "@/db/drizzle";
import { users as UsersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "./getUserAction";

export const deleteUser = async (email: string) => {
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

      const deleteUser = await db
        .delete(UsersTable)
        .where(eq(UsersTable.id, selectedUser.id));

      if (deleteUser.rowCount < 1) {
        return {
          status: "failed",
          message: "Error deleting user from database.",
          clientMessage:
            "There was an error deleting the user, please try again.",
        };
      }

      if (deleteUser.rowCount == 1) {
        return {
          status: "success",
          message: "Deleted user from database.",
          clientMessage: "Deleted user from database.",
        };
      }

      return {
        status: "failed",
        message:
          "Error deleting user from database; possibly deleted more than one user.",
        clientMessage: "Deleted user from database.",
      };
    }
  } catch (error) {
    console.log("deleteUser", error);
    return {
      status: "failed",
      message: "Error deleting user from database.",
      clientMessage: "There was an error deleting the user, please try again.",
    };
  }
};
