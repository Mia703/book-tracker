"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, GoogleBooksResponse } from "@/app/types/types";
import { useFormik } from "formik";
import { LogOut, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatSearch } from "../utils/utils";
import BookModal from "./BookModal";

export default function SearchBar() {
  const [bookResults, setBookResults] = useState<Book[] | null>(null);
  const [searchToggle, setSearchToggle] = useState<boolean>(false);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: async (values) => {
      if (values.search !== "") {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${formatSearch(values.search)}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`,
          {
            method: "GET",
            headers: { "Content-type": "application/json" },
          },
        );

        if (response.ok) {
          const data = await response.json();

          const booksList: Book[] = (data as GoogleBooksResponse).items
            .slice(0, 5)
            .map((item) => {
              const bookInfo = item.volumeInfo;

              return {
                title: bookInfo.title,
                subtitle: bookInfo.subtitle,
                authors: bookInfo.authors,
                description: bookInfo.description,
                categories: bookInfo.categories,
                imageLinks: bookInfo.imageLinks,
                industryIdentifiers: bookInfo.industryIdentifiers,
                pageCount: bookInfo.pageCount,
                publishedDate: bookInfo.publishedDate,
                publisher: bookInfo.publisher,
              };
            });
          console.log(booksList);
          setBookResults(booksList);
          setSearchToggle(true);
        } else {
          // TODO: do something...
        }
      }
    },
  });

  return (
    <section
      id="search-bar-section"
      className="col-span-4 p-4 md:col-span-6 lg:col-span-12"
    >
      <div className="search-bar-wrapper grid w-full grid-cols-2 justify-end gap-4 md:flex">
        <div className="search-wrapper relative col-span-2 row-2 w-full">
          <form
            action=""
            method="post"
            onSubmit={formik.handleSubmit}
            className="mr-4 flex w-full flex-row"
            id="search-form"
          >
            <Input
              type="search"
              name="search"
              id="search-bar"
              placeholder="Search..."
              className={
                searchToggle
                  ? "bg-primary-light-pink border-primary-dark-pink relative rounded-r-none rounded-bl-none border-2"
                  : "bg-primary-light-pink border-primary-dark-pink rounded-r-none border-2"
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.search}
            />
            <Button
              className={
                searchToggle
                  ? "pink rounded-l-none rounded-br-none hover:cursor-pointer"
                  : "pink rounded-l-none hover:cursor-pointer"
              }
              type="submit"
            >
              <Search />
            </Button>
          </form>
          {searchToggle && (
            <div
              className="search-results-wrapper bg-primary-light-pink border-primary-dark-pink absolute left-0 z-10 flex h-[75vh] flex-col gap-4 overflow-y-scroll rounded-b-md border-r-2 border-b-2 border-l-2 p-4 shadow-md"
              style={{ width: "100%" }}
            >
              {bookResults &&
                bookResults.map((book, index) => (
                  <div
                    key={index}
                    className="book-results-wrapper flex cursor-pointer flex-row items-center justify-start gap-4"
                    onClick={() => {
                      setSelectedBook(bookResults[index]);
                      setSearchToggle(false);
                      setDisplayModal(true);
                    }}
                  >
                    <div className="book-image-wrapper h-full max-w-[100px] min-w-[80px] md:w-[100px]">
                      {book.imageLinks?.smallThumbnail ? (
                        <Image
                          src={book.imageLinks?.smallThumbnail}
                          alt={`${book.title}`}
                          width={128}
                          height={192}
                          className="book-image h-full w-full"
                        />
                      ) : (
                        <div className="book-image border-primary-black max-w-[100px] min-w-[80px] border-1 p-2 md:w-[100px]">
                          No image available
                        </div>
                      )}
                    </div>

                    <p>
                      <span className="font-bold capitalize">
                        {book.title}
                        {book.subtitle ? `: ${book.subtitle}` : ""}
                      </span>{" "}
                      {book.authors ? `by ${book.authors.join(", ")}` : ""}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="buttons-wrapper col-span-2 row-1 flex flex-row justify-end gap-4">
          <Button
            type="button"
            className="add-book-btn pink cursor-pointer"
            onClick={() => {
              setDisplayModal(true);
            }}
          >
            <Plus />
          </Button>
          <Button
            type="button"
            className="logout-btn pink cursor-pointer"
            onClick={() => {
              window.sessionStorage.removeItem("user");
              router.push("/");
            }}
          >
            Logout <LogOut />
          </Button>
        </div>
      </div>
      {displayModal && selectedBook && (
        <BookModal
          book={selectedBook}
          setDisplayModal={setDisplayModal}
          setSearchToggle={setSearchToggle}
        />
      )}
    </section>
  );
}
