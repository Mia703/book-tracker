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
import { capitaliseSentence, modifyLibraryCache } from "../pages/utils/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X } from "lucide-react";

type BookCreateFormProps = {
  setCache: Dispatch<SetStateAction<LibraryList>>;
};

export default function BookCreateForm({ setCache }: BookCreateFormProps) {
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
      title: "",
      subtitle: "",
      authors: "",
      publisher: "",
      publishedDate: "",
      description: "",
      isbnType: "",
      isbn: "",
      pageCount: "",
      categories: "",
      bookImage: "",
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

        // CREATE BOOK
        const book: Book = {
          title: capitaliseSentence(values.title),
          subtitle: capitaliseSentence(values.subtitle),
          authors: values.authors
            .split(", ")
            .map((author) => capitaliseSentence(author)),
          publisher: capitaliseSentence(values.publisher),
          publishedDate: values.publishedDate,
          description: values.description,
          industryIdentifiers: [
            {
              type: values.isbnType,
              identifier: values.isbn,
            },
          ],
          pageCount: Number(values.pageCount),
          categories: values.categories
            .split(", ")
            .map((category) => capitaliseSentence(category)),
          imageLinks: {
            smallThumbnail: values.bookImage,
            thumbnail: values.bookImage,
          },
          userInfo: {
            readingProgress: values.readingProgress,
            readingFormat: values.readingFormat,
            startDate: values.startDate,
            endDate: values.endDate,
            rating: values.rating,
            comments: values.comments,
            userEmail: user.email,
            googleBook: false,
          },
        };

        // SAVE BOOK TO DB
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
              googleBook: false,
            },
          }),
        });

        const data = await response.json();

        if (
          response.ok &&
          data.message.messageType === "good" &&
          book.userInfo
        ) {
          // UPDATE BOOK'S XATA INFORMATION
          const xataData = JSON.parse(data.message.xataData);
          book.userInfo.xata_createdat = xataData.xata_createdat;
          book.userInfo.xata_id = xataData.xata_id;
          book.userInfo.xata_updatedat = xataData.xata_updatedat;
          book.userInfo.xata_version = xataData.xata_version;
        }

        await new Promise((res) => setTimeout(res, 200));

        // ADD BOOK TO CACHE
        modifyLibraryCache(
          setCache,
          "add",
          book,
          values.readingProgress as keyof LibraryList,
          values.readingProgress as keyof LibraryList,
        );

        setAlert({
          messageType: data.message.messageType,
          message: data.message.clientMessage,
        });
      }
    },
  });

  return (
    <div className="create-book-form-wrapper">
      <form
        action=""
        method="post"
        className="flex flex-col gap-4"
        onSubmit={formik.handleSubmit}
      >
        <h2 className="font-bold">Book Information</h2>

        <Input
          type="text"
          name="title"
          id="title"
          placeholder="Title*"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          className="border-red-300"
          required
        />

        <Input
          type="text"
          name="subtitle"
          id="subtitle"
          placeholder="Subtitle"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.subtitle}
        />

        <Input
          type="text"
          name="authors"
          id="authors"
          placeholder="Authors (comma separated)"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.authors}
        />

        <div className="input-wrapper">
          <Label htmlFor="description" className="mb-2 font-bold">
            Description
          </Label>
          <Textarea
            name="description"
            id="description"
            placeholder="What was the book about?"
            rows={30}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
          />
        </div>

        <Input
          type="text"
          name="categories"
          id="categories"
          placeholder="Categories (comma separated)"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.categories}
        />

        <Input
          type="text"
          name="bookImage"
          id="bookImage"
          placeholder="Book Image"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bookImage}
        />

        <Select
          name="isbnType"
          onValueChange={(value) => formik.setFieldValue("isbnType", value)}
          defaultValue={formik.values.isbnType}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="ISBN Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ISBN_10">ISBN 10</SelectItem>
            <SelectItem value="ISBN_13">ISBN 13</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          name="isbn"
          id="isbn"
          placeholder="ISBN"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.isbn}
        />

        <Input
          type="text"
          name="pageCount"
          id="pageCount"
          placeholder="Page Count"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.pageCount}
        />

        <div className="input-wrapper">
          <Label htmlFor="publishedDate" className="mb-2 font-bold">
            Published Date
          </Label>
          <Input
            type="date"
            name="publishedDate"
            id="publishedDate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.publishedDate}
          />
        </div>

        <Input
          type="text"
          name="publisher"
          id="publisher"
          placeholder="Publisher"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.publisher}
        />

        <hr className="divider border-primary-medium-pink border-1" />

        <h2 className="font-bold">Reading Information</h2>

        <Select
          name="readingProgress"
          onValueChange={(value) => {
            formik.setFieldValue("readingProgress", value);
          }}
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

        <Button type="submit" className="pink cursor-pointer">
          Save Book
        </Button>
      </form>
    </div>
  );
}
