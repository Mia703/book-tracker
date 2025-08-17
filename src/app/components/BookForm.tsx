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
import { Book } from "../types/types";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Check, X } from "lucide-react";

type BookFormProps = {
  book: Book;
  setUserInfo: Dispatch<SetStateAction<boolean>>;
};

export default function BookForm({ book, setUserInfo }: BookFormProps) {
  const [displayAlert, setDisplayAlert] = useState<boolean | null>(null);
  const [alertType, setAlertType] = useState("");

  // formats alert contents based on fetch data
  function formatAlert(alertType: string) {
    switch (alertType) {
      case "update":
        return (
          <Alert className="border-green-600">
            <Check className="stroke-green-600" />
            <AlertTitle className="text-green-600">
              This book is already in your library. Book has been updated.
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
      console.log("BookForm Error: Please select a reading progress");
    }),
  });

  const formik = useFormik({
    initialValues: {
      readingProgress: "",
      rating: "",
      readingFormat: "",
      startDate: "",
      endDate: "",
      comments: "",
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
    <div className="book-form-wrapper border-primary-medium-pink border-t-2">
      <form
        action=""
        id="book-form"
        className="my-4 grid grid-cols-2 gap-4"
        onSubmit={formik.handleSubmit}
      >
        <div className="input-wrapper col-span-2 grid grid-cols-3 gap-4">
          <Select
            name="readingProgress"
            onValueChange={(value) =>
              formik.setFieldValue("readingProgress", value)
            }
            defaultValue={formik.values.readingProgress}
            required
          >
            <SelectTrigger className="col-span-3 w-full border-red-300 md:col-span-1">
              <SelectValue placeholder="Reading Progress*" />
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
            <SelectTrigger className="col-span-3 w-full md:col-span-1">
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
            <SelectTrigger className="col-span-3 w-full md:col-span-1">
              <SelectValue placeholder="Reading Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eBook">E-book</SelectItem>
              <SelectItem value="paper">Paper</SelectItem>
              <SelectItem value="libraryLoan">Library Loan</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="input-wrapper md:flex md:flex-row md:gap-2">
          <Label
            htmlFor="startDate"
            className="mb-2 w-auto font-bold whitespace-nowrap md:mb-0"
          >
            Start Date
          </Label>
          <Input
            type="date"
            name="startDate"
            id="startDate"
            className="flex-1"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startDate}
          />
        </div>

        <div className="input-wrapper md:flex md:flex-row md:gap-2">
          <Label
            htmlFor="endDate"
            className="mb-2 w-auto font-bold whitespace-nowrap md:mb-0"
          >
            End Date
          </Label>
          <Input
            type="date"
            name="endDate"
            id="endDate"
            max={today} // date restriction - prevents you from selecting anything after the current date
            className="flex-1"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.endDate}
          />
        </div>

        <div className="input-wrapper col-span-2">
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
            className="w-full rounded-md border-2 p-4"
          />
        </div>

        {displayAlert && (
          <div className="alert-wrapper col-span-2">
            {formatAlert(alertType)}
          </div>
        )}

        <div className="button-wrapper col-span-2 inline-flex w-full gap-4">
          <Button
            type="button"
            className="w-full flex-1 cursor-pointer"
            onClick={() => {
              formik.resetForm(); // clear any inputted data
              setUserInfo(false); // close the form
            }}
          >
            Exit
          </Button>

          <Button type="submit" className="pink w-full flex-1/2 cursor-pointer">
            Save Book
          </Button>
        </div>
      </form>
    </div>
  );
}
