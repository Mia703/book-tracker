"use server";

import { db } from "@/db/drizzle";
import { users as usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// CRUD OPERATIONS - CREATE, READ, UPDATE, DELETE

// ------ CREATE
export const addUser = async (
  firstName: string,
  lastName: string,
  email: string,
) => {
  try {
    const selectedUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (selectedUser.length > 0) {
      return {
        status: "failed",
        message: "User already exists.",
        clientMessage: "This email already exists, please login.",
      };
    } else {
      const user = await db
        .insert(usersTable)
        .values({ firstName, lastName, email });

      if (user.rowCount > 0) {
        const selectedUser = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email));

        return {
          status: "success",
          message: "Added user to database.",
          result: selectedUser[0],
        };
      } else {
        return {
          status: "failed",
          message: "Error adding user to database",
          clientMessage: "There was an error signing up, please try again.",
        };
      }
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

// ------ READ
export const getUser = async (email: string) => {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (user.length > 0) {
      return {
        status: "success",
        message: "Got user from database",
        result: user[0],
      };
    } else {
      return {
        status: "failed",
        message: "Error getting user from database",
        clientMessage: "Could not find email in database, please sign up.",
      };
    }
  } catch (error) {
    console.log("getUser", error);
    return {
      status: "failed",
      message: "Error getting user from database",
      clientMessage: "There was an error logging in, please try again.",
    };
  }
};

// ------ UPDATE
export const updateUser = async (
  id: number,
  firstName: string,
  lastName: string,
  email: string,
) => {
  try {
    const user = await db
      .update(usersTable)
      .set({ firstName, lastName, email })
      .where(eq(usersTable.email, email));

    if (user.rowCount > 0) {
      return {
        status: "success",
        message: "Updated user in database",
        clientMessage: "Your account has been updated successfully.",
      };
    } else {
      return {
        status: "failed",
        message: "Error updating user",
        clientMessage:
          "There was an error updating your account, please try again.",
      };
    }
  } catch (error) {
    console.log("updateUser", error);
    return {
      status: "failed",
      message: "Error updating user.",
      clientMessage: "There was an error updating this user, please try again.",
    };
  }
};

// ------ DELETE
export const removeUserByEmail = async (email: string) => {
  try {
    const user = await db.delete(usersTable).where(eq(usersTable.email, email));

    if (user.rowCount > 0) {
      return {
        status: "success",
        message: "Deleted user from database",
        clientMessage: "Your account has been deleted.",
      };
    } else {
      return {
        status: "failed",
        message: "Error deleting user from database",
        clientMessage: "This email does not exist, please sign up.",
      };
    }
  } catch (error) {
    console.log("deleteUser", error);
    return {
      status: "failed",
      message: "Error deleting user from database.",
      clientMessage:
        "There was an error deleting this email, please try again.",
    };
  }
};

export const removeUser = async (id: number) => {
  try {
    const user = await db.delete(usersTable).where(eq(usersTable.id, id));
    console.log(user);
  } catch (error) {
    console.log("deleteUser", error);
    return {
      status: "failed",
      message: "Error deleting user from database.",
      clientMessage:
        "There was an error deleting this email, please try again.",
    };
  }
};
