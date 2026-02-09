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

interface BookFormProps {
  user:
    | {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
      }
    | undefined;
}

export default function BookForm({ user }: BookFormProps) {
  const [alert, setAlert] = useState<boolean>(false);
  const today = new Date().toISOString().slice(0, 10);

  const formik = useFormik({
    initialValues: {
      bookInformation: {
        title: "",
        subtitle: "",
        authors: "",
        description: "",
        categories: "",
        isbn: "",
        bookImage: "",
        pageCount: "",
        publishedDate: "",
        publisher: "",
      },
      readerInformation: {
        readingProgress: "",
        rating: "",
        readingFormat: "",
        startDate: "",
        endDate: "",
        comments: "",
      },
    },
    // validationSchema: formValidation,
    onSubmit: (values) => {
      console.log("submitted");
      console.log(values);
      console.log(user);
    },
  });

  return (
    <form
      action=""
      method="post"
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="book-info-wrapper flex flex-col gap-5">
        <h2 className="font-bold">Book Information</h2>

        {/* TITLE */}
        <Input
          type="text"
          name="bookInformation.title"
          id="title"
          placeholder="Title*"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bookInformation.title}
          className="border-red-300"
          required
        />
        {/* SUBTITLE */}
        <Input
          type="text"
          name="bookInformation.subtitle"
          id="subtitle"
          placeholder="Subtitle"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bookInformation.subtitle}
        />
        {/* AUTHORS */}
        <Input
          type="text"
          name="bookInformation.authors"
          id="authors"
          placeholder="Authors (comma separated)"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bookInformation.authors}
        />
        {/* DESCRIPTION */}
        <div className="input-wrapper">
          <Label htmlFor="description" className="mb-2 font-bold">
            Book Description
          </Label>
          <Textarea
            name="bookInformation.description"
            id="description"
            placeholder="What was the book about?"
            rows={30}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.bookInformation.description}
          />
        </div>
        {/* BOOK IMAGE */}
        <Input
          type="text"
          name="bookInformation.bookImage"
          id="bookImage"
          placeholder="Book Image"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bookInformation.bookImage}
        />
        {/* ISBN */}
        <Input
          type="text"
          name="bookInformation.isbn"
          id="isbn"
          placeholder="ISBN/ASIN"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bookInformation.isbn}
        />
        {/* PUBLISHER */}
        <Input
          type="text"
          name="bookInformation.publisher"
          id="publisher"
          placeholder="Publisher"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bookInformation.publisher}
        />
        {/* PUBLISHED DATE */}
        <div className="input-wrapper">
          <Label htmlFor="publishedDate" className="mb-2 font-bold">
            Publication Date
          </Label>
          <Input
            type="date"
            name="bookInformation.publishedDate"
            id="publishedDate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bookInformation.publishedDate}
          />
        </div>
        {/* PAGE COUNT */}
        <Input
          type="text"
          name="bookInformation.pageCount"
          id="pageCount"
          placeholder="Page Count"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bookInformation.pageCount}
        />
        {/* CATEGORIES */}
        <Input
          type="text"
          name="bookInformation.categories"
          id="categories"
          placeholder="Categories (comma separated)"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bookInformation.categories}
        />
      </div>

      <hr className="divider border-primary-medium-pink border-1" />

      <div className="reader-info-wrapper flex flex-col gap-5">
        <h2 className="font-bold">Reader Information</h2>
        {/* READING PROGRESS */}
        <Select
          name="readerInformation.readingProgress"
          onValueChange={(value) =>
            formik.setFieldValue("readerInformation.readingProgress", value)
          }
          defaultValue={formik.values.readerInformation.readingProgress}
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
        {/* RATING */}
        <Select
          name="rating"
          onValueChange={(value) =>
            formik.setFieldValue("readerInformation.rating", value)
          }
          defaultValue={formik.values.readerInformation.rating}
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
        {/* READING FORMAT */}
        <Select
          name="readingFormat"
          onValueChange={(value) =>
            formik.setFieldValue("readerInformation.readingFormat", value)
          }
          defaultValue={formik.values.readerInformation.readingFormat}
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
        {/* START DATE */}
        <div className="input-wrapper">
          <Label htmlFor="startDate" className="mb-2 font-bold">
            Start Date
          </Label>
          <Input
            type="date"
            name="readerInformation.startDate"
            id="startDate"
            max={today} // date restriction - prevents you from selecting anything after the current date
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.readerInformation.startDate}
          />
        </div>
        {/* END DATE */}
        <div className="input-wrapper">
          <Label htmlFor="endDate" className="mb-2 font-bold">
            End Date
          </Label>
          <Input
            type="date"
            name="readerInformation.endDate"
            id="endDate"
            max={today} // date restriction - prevents you from selecting anything after the current date
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.readerInformation.endDate}
          />
        </div>
        {/* COMMENTS */}
        <div className="input-wrapper">
          <Label htmlFor="comments" className="mb-2 font-bold">
            Comments
          </Label>
          <Textarea
            name="readerInformation.comments"
            id="comments"
            placeholder="What did you think about the book?"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.readerInformation.comments}
          />
        </div>
      </div>

      {/* SUBMIT */}
      <div className="button-wrapper mt-4 flex flex-row gap-2">
        <Button type="button" className="cursor-pointer bg-red-700">
          Delete Book
        </Button>

        <Button type="submit" className="pink flex-1 cursor-pointer">
          {/* {book.userInfo ? "Update" : "Save Book"} */}
          Save Book
        </Button>
      </div>
    </form>
  );
}
