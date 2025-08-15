import { Dispatch, SetStateAction } from "react";
import { Book } from "../types/types";
import Image from "next/image";

type SearchBarResultsProps = {
  bookResults: Book[] | null;
  setSelectedBook: Dispatch<SetStateAction<Book | null>>;
  setSearchToggle: Dispatch<SetStateAction<boolean>>;
  setDisplayModal: Dispatch<SetStateAction<boolean>>;
};

export default function SearchBarResults({
  bookResults,
  setSelectedBook,
  setSearchToggle,
  setDisplayModal,
}: SearchBarResultsProps) {
  return (
    <div
      className="search-results-wrapper bg-primary-light-pink border-primary-dark-pink absolute left-0 z-10 flex h-[75vh] flex-col gap-4 overflow-y-scroll rounded-b-md border-r-2 border-b-2 border-l-2 p-4 shadow-md"
      style={{ width: "100%" }}
    >
      {bookResults &&
        bookResults.map((book, index) => (
          <div
            key={index}
            className="book-results-wrapper z-10 flex cursor-pointer flex-row items-center justify-start gap-4"
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
  );
}
