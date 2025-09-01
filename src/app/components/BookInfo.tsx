import Image from "next/image";
import { Book, LibraryList } from "../types/types";
import { Dispatch, SetStateAction, useState } from "react";
import BookForm from "./BookForm";

type BookInfoProps = {
  book: Book;
  setCache: Dispatch<SetStateAction<LibraryList>>;
};

export default function BookInfo({ book, setCache }: BookInfoProps) {
  const [toggleBookLength, setToggleBookLength] = useState<boolean>(true);

  return (
    <div className="book-info">
      {/* BOOK iMAGE */}
      <div className="book-image-wrapper relative my-4 flex w-full flex-col items-center justify-center">
        <div className="circle-bg bg-primary-medium-pink h-[240px] w-[240px] rounded-[10000px]"></div>
        <div className="book-image absolute top-0 z-10 w-[160px]">
          {book.imageLinks?.thumbnail ? (
            <Image
              src={book.imageLinks?.thumbnail}
              alt={`${book.title}`}
              width={128 * 8}
              height={192 * 8}
              className="book-image h-auto w-full"
            />
          ) : (
            <div className="book-image border-primary-black flex h-60 w-full flex-col items-center justify-center border-1 bg-white p-4 text-center">
              <p>No image available</p>
            </div>
          )}
        </div>
        <div className="book-shadow bg-primary-black relative bottom-5 h-[20px] w-[200px] rounded-[10000px] blur-xl"></div>
      </div>

      <div className="book-info-wrapper">
        {/* BOOK TITLE */}
        <div className="book-title-wrapper text-center">
          <h1 className="book-title text-lg font-bold">
            {book.title}
            {book.subtitle ? `: ${book.subtitle}` : ""}
          </h1>
          <h2 className="book-author">{book.authors?.join(", ")}</h2>
        </div>

        {/* BOOK DESCRIPTION */}
        <div className="book-description-wrapper border-primary-medium-pink border-b-2 py-4">
          {book.description &&
            (book.description.length > 270 ? (
              toggleBookLength ? (
                <p className="book-description text-sm">
                  {book.description.slice(0, 270).concat("...")}
                  <br />
                  <button
                    type="button"
                    className="cursor-pointer text-sm font-bold underline"
                    onClick={() => {
                      setToggleBookLength(!toggleBookLength);
                    }}
                  >
                    Read More
                  </button>{" "}
                </p>
              ) : (
                <p className="book-description text-sm">
                  {book.description}
                  <br />
                  <button
                    type="button"
                    className="cursor-pointer text-sm font-bold underline"
                    onClick={() => {
                      setToggleBookLength(!toggleBookLength);
                    }}
                  >
                    Read Less
                  </button>{" "}
                </p>
              )
            ) : (
              <p className="book-description text-sm">{book.description}</p>
            ))}
        </div>

        {/* BOOK INFORMATION -- FROM THE USER */}
        <div className="book-user-info-grid border-primary-medium-pink mb-4 grid grid-cols-2 gap-x-4 gap-y-2 border-b-2 py-4">
          <p className="font-bold capitalize">
            Publisher
            <br />
            <span className="font-normal">{book.publisher}</span>
          </p>
          <p className="font-bold capitalize">
            Published date
            <br />
            <span className="font-normal">
              {book.publishedDate
                ? new Date(book.publishedDate).toDateString()
                : ""}
            </span>
          </p>
          <p className="font-bold capitalize">
            No. of pages
            <br />
            <span className="font-normal">{book.pageCount}</span>
          </p>
          <p className="font-bold capitalize">
            ISBN
            <br />
            <span className="font-normal wrap-break-word">
              {/* filter for ISBN_13,then ISBN_10, which returns another array, then map through it, else returns "" */}
              {book.industryIdentifiers
                ?.filter((item) => item.type === "ISBN_13")
                .map((item) => item.identifier) ||
                book.industryIdentifiers
                  ?.filter((item) => item.type === "ISBN_10")
                  .map((item) => item.identifier) ||
                ""}
            </span>
          </p>
          <p className="col-span-2 font-bold capitalize">
            Category
            <br />
            <span className="font-normal">{book.categories?.join(",")}</span>
          </p>
        </div>
      </div>

      {/* BOOK FORM */}
      <BookForm book={book} setCache={setCache} />
    </div>
  );
}
