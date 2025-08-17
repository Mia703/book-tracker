import Image from "next/image";
import { Book as BookType, UserBook } from "../types/types";

type BookProps = {
  book: BookType;
  userInfo: UserBook;
};

export default function Book({ book, userInfo }: BookProps) {
  return (
    <div className="book cursor-pointer">
      <div className="book-image-wrapper w-[8rem]">
        {book.imageLinks?.smallThumbnail ? (
          <Image
            src={book.imageLinks?.smallThumbnail}
            alt={`${book.title}`}
            width={128}
            height={192}
            className="book-image h-full w-full mb-2"
          />
        ) : (
          <div className="book-image border-primary-black max-w-[100px] min-w-[80px] border-1 p-2 md:w-[100px]">
            No image available
          </div>
        )}
      </div>
      <p className="max-w-[20ch] text-xs font-bold capitalize">
        {book.title}
        {book.subtitle ? `: ${book.subtitle}` : ""}
      </p>
      <p className="max-w-[25ch] text-xs capitalize">
        {book.authors ? `${book.authors[0]}` : ""}
      </p>
    </div>
  );
}
