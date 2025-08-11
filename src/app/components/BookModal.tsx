import { Book } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type BookModalProps = {
  book: Book;
  setDisplayModal: Dispatch<SetStateAction<boolean>>;
  setSearchToggle: Dispatch<SetStateAction<boolean>>;
};

export default function BookModal({
  book,
  setDisplayModal,
  setSearchToggle,
}: BookModalProps) {
  return (
    <div className="book-modal-background fixed top-0 left-0 z-40 flex h-dvh w-full flex-col items-center bg-gray-400/10 p-4">
      <div className="book-modal bg-light-pink border-primary-dark-pink bg-primary-light-pink h-full overflow-y-scroll rounded-md border-2 p-6 md:h-[80vh] md:w-[75vw] lg:h-[90vh] lg:w-[50vw]">
        <div className="book-modal-button-wrapper mb-6">
          <Button
            className="pink cursor-pointer"
            onClick={() => {
              setSearchToggle(true);
              setDisplayModal(false);
            }}
          >
            <ChevronLeft /> Back
          </Button>
        </div>

        <div className="book-modal-book-image-wrapper relative my-4 flex w-full flex-col items-center justify-center">
          <div className="circle-bg bg-primary-medium-pink h-[240px] w-[240px] rounded-[10000px]"></div>
          <div className="book-image absolute top-0 z-10 w-[160px]">
            {book.imageLinks?.thumbnail ? (
              <Image
                src={book.imageLinks?.thumbnail}
                alt={`${book.title}`}
                width={128 * 5}
                height={192 * 5}
                className="book-image h-full w-full"
              />
            ) : (
              <div className="book-image border-primary-black max-w-[100px] min-w-[80px] border-1 p-2 md:w-[100px]">
                No image available
              </div>
            )}
          </div>
          <div className="book-shadow bg-primary-black relative bottom-5 mb-6 h-[20px] w-[200px] rounded-[10000px] blur-2xl"></div>
        </div>

        <div className="book-info-wrapper">
          <div className="book-title-wrapper bg-primary-light-pink text-center">
            <h1 className="book-title font-bold">
              {book.title}
              {book.subtitle ? `: ${book.subtitle}` : ""}
            </h1>
            <h2 className="book-author">{book.authors?.join(", ")}</h2>
          </div>

          <div className="book-description-wrapper my-4">
            <p className="book-description">{book.description}</p>
          </div>

          <div className="wrapper">
            <div className="book-info-grid mb-4 grid grid-cols-2 gap-x-4 gap-y-2">
              <p className="font-bold capitalize">
                Publisher <br className="md:hidden" />
                <span className="font-normal">{book.publisher}</span>
              </p>
              <p className="font-bold capitalize">
                Release date
                <br className="md:hidden" />{" "}
                <span className="font-normal">{book.publishedDate}</span>
              </p>
              <p className="font-bold capitalize">
                No. of page
                <br className="md:hidden" />{" "}
                <span className="font-normal">{book.pageCount}</span>
              </p>
              <p className="font-bold capitalize">
                ISBN
                <br className="md:hidden" />{" "}
                <span className="font-normal">
                  {/* filter for ISBN_13, which returns another array, then map through it */}
                  {book.industryIdentifiers
                    ?.filter((item) => item.type === "ISBN_13")
                    .map((item) => item.identifier) || ""}
                </span>
              </p>
              <p className="col-span-2 font-bold capitalize">
                Genres
                <br className="md:hidden" />{" "}
                <span className="font-normal">
                  {book.categories?.join(",")}
                </span>
              </p>
            </div>
            <div className="user-info-grid mb-4 grid grid-cols-2 gap-x-4 gap-y-2">
              <p className="font-bold capitalize">
                Start date
                <br className="md:hidden" />{" "}
                <span className="font-normal">?</span>
              </p>
              <p className="font-bold capitalize">
                End date
                <br className="md:hidden" />{" "}
                <span className="font-normal">?</span>
              </p>
              <p className="font-bold capitalize">
                Rating
                <br className="md:hidden" />{" "}
                <span className="font-normal">?</span>
              </p>
              <p className="font-bold capitalize">
                Reading format
                <br className="md:hidden" />{" "}
                <span className="font-normal">?</span>
              </p>
              <div className="col-span-2">
                <p className="font-bold">Comments</p>
                <textarea
                  name="comments"
                  id="comments"
                  rows={5}
                  placeholder="What did you think about the book?"
                  className="w-full rounded-md border-2 p-4"
                  disabled
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="book-modal-button-wrapper w-full">
          <Button className="pink w-full cursor-pointer">
            Edit <Pencil />
          </Button>
        </div>
      </div>
    </div>
  );
}
