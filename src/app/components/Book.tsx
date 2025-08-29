import Image from "next/image";
import { Book as BookType } from "../types/types";

type BookProps = {
  book: BookType;
};

export default function Book({ book }: BookProps) {
  return (
    <div className="book cursor-pointer">
      <div className="book-image-wrapper mb-2 h-auto min-w-[8rem]">
        {book.imageLinks?.smallThumbnail ? (
          <Image
            src={book.imageLinks?.smallThumbnail}
            alt={`${book.title}`}
            width={128}
            height={192}
            priority={true}
          />
        ) : (
          <div className="book-image border-primary-black border-1 p-2 h-50 flex flex-row items-center w-full">
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
