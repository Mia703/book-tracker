"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import * as Yup from "yup";
import { Book, LibraryList } from "../types/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X } from "lucide-react";
import { modifyLibraryCache } from "../pages/utils/utils";

type BookFormProps = {
  book: Book;
  setCache: Dispatch<SetStateAction<LibraryList>>;
};

export default function BookForm({ book, setCache }: BookFormProps) {
  const [alert, setAlert] = useState<{
    messageType: string;
    message: string;
  } | null>(null);

  // get the current date in the format of YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  const formValidation = Yup.object({
    readingProgress: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      readingProgress: book.userInfo?.readingProgress ?? "",
      rating: book.userInfo?.rating ?? "",
      readingFormat: book.userInfo?.readingFormat ?? "",
      startDate: book.userInfo?.startDate
        ? new Date(book.userInfo.startDate).toISOString().slice(0, 10)
        : "",
      endDate: book.userInfo?.endDate
        ? new Date(book.userInfo.endDate).toISOString().slice(0, 10)
        : "",
      comments: book.userInfo?.comments ?? "",
    },
    validationSchema: formValidation,
    onSubmit: async (values) => {
      const userData = window.sessionStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);

        // SAVE/UPDATE THE BOOK IN DB
        const response = await fetch("/pages/api/books/setBook", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            book: book,
            userInfo: {
              readingProgress: values.readingProgress,
              readingFormat: values.readingFormat,
              startDate: values.startDate,
              endDate: values.endDate,
              rating: values.rating,
              comments: values.comments,
              userEmail: user.email,
              googleBook: book.googleBookId ? true : false,
            },
          }),
        });

        const data = await response.json();

        // DISPLAY CLIENT MESSAGE FROM XATA
        setAlert({
          messageType: data.message.messageType,
          message: data.message.clientMessage,
        });

        if (response.ok && data.message.messageType === "good") {
          await new Promise((res) => setTimeout(res, 3000)); // WAIT 3 SECONDS

          const readingProgress = book.userInfo?.readingProgress;

          // UPDATE THE BOOK'S USER INFORMATION
          book.userInfo = {
            readingProgress: values.readingProgress,
            readingFormat: values.readingFormat,
            startDate: values.startDate,
            endDate: values.endDate,
            rating: values.rating,
            comments: values.comments,
            userEmail: user.email,
            googleBook: book.googleBookId ? true : false,
          };

          // UPDATE BOOK'S XATA INFORMATION
          const xataData = JSON.parse(data.message.xataData);
          book.userInfo.xata_createdat = xataData.xata_createdat;
          book.userInfo.xata_id = xataData.xata_id;
          book.userInfo.xata_updatedat = xataData.xata_updatedat;
          book.userInfo.xata_version = xataData.xata_version;

          // ADD BOOK TO THE LIBRARY LIST
          modifyLibraryCache(
            setCache,
            book.userInfo ? "update" : "add",
            book,
            readingProgress as keyof LibraryList,
            values.readingProgress as keyof LibraryList,
          );
        }
      }
    },
  });

  return (
    <div className="book-form-wrapper border-primary-medium-pink border-b-2 py-4">
      <form
        action=""
        method="post"
        className="flex flex-col gap-4"
        onSubmit={formik.handleSubmit}
      >
        <Select
          name="readingProgress"
          onValueChange={(value) =>
            formik.setFieldValue("readingProgress", value)
          }
          defaultValue={formik.values.readingProgress}
          required
        >
          <SelectTrigger className="w-full border-red-300">
            <SelectValue placeholder="Reading Progress *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wishlist">Wish List</SelectItem>
            <SelectItem value="reading">Reading</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
            <SelectItem value="dnf">DNF</SelectItem>
          </SelectContent>
        </Select>

        <Select
          name="rating"
          onValueChange={(value) => formik.setFieldValue("rating", value)}
          defaultValue={formik.values.rating}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masterpiece">(5) Masterpiece</SelectItem>
            <SelectItem value="great">(4) Great</SelectItem>
            <SelectItem value="good">(3) Good</SelectItem>
            <SelectItem value="average">(2) Average</SelectItem>
            <SelectItem value="appalling">(1) Appalling</SelectItem>
          </SelectContent>
        </Select>

        <Select
          name="readingFormat"
          onValueChange={(value) =>
            formik.setFieldValue("readingFormat", value)
          }
          defaultValue={formik.values.readingFormat}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Reading Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eBook">E-book</SelectItem>
            <SelectItem value="paper">Paper</SelectItem>
            <SelectItem value="libraryLoan">Library Loan</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>

        <div className="input-wrapper">
          <Label htmlFor="startDate" className="mb-2 font-bold">
            Start Date
          </Label>
          <Input
            type="date"
            name="startDate"
            id="startDate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startDate}
          />
        </div>

        <div className="input-wrapper">
          <Label htmlFor="endDate" className="mb-2 font-bold">
            End Date
          </Label>
          <Input
            type="date"
            name="endDate"
            id="endDate"
            max={today} // date restriction - prevents you from selecting anything after the current date
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.endDate}
          />
        </div>

        <div className="input-wrapper">
          <Label htmlFor="comments" className="mb-2 font-bold">
            Comments
          </Label>
          <Textarea
            name="comments"
            id="comments"
            placeholder="What did you think about the book?"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.comments}
          />
        </div>

        {alert &&
          (alert.messageType == "bad" ? (
            <Alert variant={"destructive"}>
              <X />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ) : (
            <Alert variant={"default"}>
              <Check />
              <AlertDescription className="text-primary-black">
                {alert.message}
              </AlertDescription>
            </Alert>
          ))}

        <div className="button-wrapper flex flex-row gap-2">
          {
            <Button
              type="button"
              className="cursor-pointer"
              onClick={async () => {
                console.log("delete book", book);

                const response = await fetch("/pages/api/books/deleteBook", {
                  method: "POST",
                  headers: { "Content-type": "application/json" },
                  body: JSON.stringify({ bookId: book.userInfo?.xata_id }),
                });

                if (response.ok) {
                  const data = await response.json();

                  await new Promise((res) => setTimeout(res, 200));

                  // REMOVE BOOK TO CACHE
                  modifyLibraryCache(
                    setCache,
                    "delete",
                    book,
                    book.userInfo?.readingProgress as keyof LibraryList,
                    book.userInfo?.readingProgress as keyof LibraryList,
                  );

                  setAlert({
                    messageType: data.message.messageType,
                    message: data.message.clientMessage,
                  });
                }
              }}
            >
              Delete
            </Button>
          }
          <Button type="submit" className="pink flex-1 cursor-pointer">
            {book.userInfo ? "Update" : "Save Book"}
          </Button>
        </div>
      </form>
    </div>
  );
}
