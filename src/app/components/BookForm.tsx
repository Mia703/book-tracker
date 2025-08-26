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
import { useState } from "react";
import * as Yup from "yup";
import { Book, UserBook } from "../types/types";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Check, X } from "lucide-react";

type BookFormProps = {
  book: Book;
  userInfo: UserBook | null;
};

export default function BookForm({ book, userInfo }: BookFormProps) {
  const [displayAlert, setDisplayAlert] = useState<boolean | null>(null);
  const [alertType, setAlertType] = useState("");

  function formatAlert(alertType: string) {
    switch (alertType) {
      case "update":
        return (
          <Alert className="border-green-600">
            <Check className="stroke-green-600" />
            <AlertTitle className="text-green-600">
              The book has been updated.
            </AlertTitle>
          </Alert>
        );
      case "new entry":
        return (
          <Alert className="border-green-600">
            <Check className="stroke-green-600" />
            <AlertTitle className="text-green-600">
              The book has been added to your library.
            </AlertTitle>
          </Alert>
        );
      case "error":
        return (
          <Alert className="border-red-600">
            <X className="stroke-red-600" />
            <AlertTitle className="text-red-600">
              The book could not be saved. Please try again.
            </AlertTitle>
          </Alert>
        );
      default:
        return (
          <Alert>
            <AlertTitle>Alert could not be identified.</AlertTitle>
          </Alert>
        );
    }
  }

  // get the current date in the format of YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  const formValidation = Yup.object({
    readingProgress: Yup.string().required(() => {
      console.error("BookForm Error: Please select a reading progress");
    }),
  });

  const formik = useFormik({
    initialValues: {
      readingProgress: userInfo?.readingProgress || "",
      rating: userInfo?.rating || "",
      readingFormat: userInfo?.readingFormat || "",
      startDate: userInfo?.startDate
        ? new Date(userInfo.startDate).toISOString().slice(0, 10)
        : "",
      endDate: userInfo?.endDate
        ? new Date(userInfo.endDate).toISOString().slice(0, 10)
        : "",
      comments: userInfo?.comments || "",
    },
    validationSchema: formValidation,
    onSubmit: async (values) => {
      const userData = window.sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);

        const response = await fetch("/pages/api/books/setBooks", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            readingProgress: values.readingProgress,
            rating: values.rating || "empty",
            readingFormat: values.readingFormat || "empty",
            startDate: values.startDate || "empty",
            endDate: values.endDate || "empty",
            comments: values.comments || "empty",
            bookImage:
              `${book.imageLinks?.thumbnail}` ||
              `${book.imageLinks?.smallThumbnail}` ||
              "empty",
            // filter for ISBN_13 first, if no data, filter for then ISBN_10, else "empty"
            isbn:
              book.industryIdentifiers
                ?.filter((item) => item.type === "ISBN_13")
                .map((item) => item.identifier)
                .join() ||
              book.industryIdentifiers
                ?.filter((item) => item.type === "ISBN_10")
                .map((item) => item.identifier)
                .join() ||
              "empty",
            userEmail: user.email,
          }),
        });

        const data = await response.json();
        setAlertType(data.message.type);
        setDisplayAlert(true);
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
            <SelectItem value="reading">Reading</SelectItem>
            <SelectItem value="wishlist">Wish List</SelectItem>
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

        {displayAlert && (
          <div className="alert-wrapper">{formatAlert(alertType)}</div>
        )}

        <div className="button-wrapper flex flex-row gap-2">
          {userInfo && (
            <Button type="button" className="cursor-pointer" onClick={() => {
              // TODO: delete book
            }}>
              Delete
            </Button>
          )}
          <Button type="submit" className="pink flex-1 cursor-pointer">
            {userInfo ? "Update Book" : "Save Book"}
          </Button>
        </div>
      </form>
    </div>
  );
}
