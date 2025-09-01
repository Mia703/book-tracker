import Image from "next/image";
import { Book } from "../types/types";

type SearchListProps = {
  book: Book;
  index: number;
};

export default function SearchList({ book, index }: SearchListProps) {
  return (
    <div
      key={index}
      className="search-result-item border-primary-medium-pink grid cursor-pointer grid-cols-[min-content_1fr] items-center gap-4 border-b-2 py-2"
    >
      <div className="book-image-wrapper w-25">
        {book.imageLinks?.smallThumbnail ? (
          <Image
            src={book.imageLinks?.smallThumbnail}
            alt={`${book.title}`}
            width={128 * 5}
            height={192 * 5}
            className="book-image h-auto w-full"
          />
        ) : (
          <div className="book-image border-primary-black flex h-35 w-full flex-col justify-center border-1 p-2 text-center">
            No image available
          </div>
        )}
      </div>
      <div className="content text-left">
        <p className="font-bold capitalize">
          {book.title}
          {book.subtitle ? `: ${book.subtitle}` : ""}
        </p>
        <p>{book.authors ? book.authors.join(", ") : ""}</p>
      </div>
    </div>
  );
}
