"use client";
import { getAllBooksByReadingStatus } from "@/actions/bookActions";
import Dropdown from "@/app/components/Dropdown";
import MainGrid from "@/app/components/MainGrid";
import MainHeader from "@/app/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Accordion } from "@radix-ui/react-accordion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BookForm from "@/app/components/BookForm";

export default function Library() {
  const [loggedin, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<
    | {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
      }
    | undefined
  >();

  const [readingList, setReadingList] = useState<
    {
      books: {
        id: number;
        title: string;
        subtitle: string | null;
        authors: string[] | null;
        description: string | null;
        categories: string[] | null;
        isbn: string | null;
        bookImage: string | null;
        pageCount: number | null;
        publishedDate: Date | null;
        publisher: string | null;
        userId: number;
        createdAt: Date;
      };
      reading_progress: {
        id: number;
        readingProgress: "reading" | "finished" | "dnf" | "wishlist";
        rating:
          | "masterpiece"
          | "great"
          | "good"
          | "average"
          | "appalling"
          | null;
        readingFormat: "e-book" | "paper" | "library loan" | "audio";
        startDate: Date | null;
        endDate: Date | null;
        comments: string | null;
        bookId: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
      };
    }[]
  >();
  const [wishlist, setWishlist] = useState<
    {
      books: {
        id: number;
        title: string;
        subtitle: string | null;
        authors: string[] | null;
        description: string | null;
        categories: string[] | null;
        isbn: string | null;
        bookImage: string | null;
        pageCount: number | null;
        publishedDate: Date | null;
        publisher: string | null;
        userId: number;
        createdAt: Date;
      };
      reading_progress: {
        id: number;
        readingProgress: "reading" | "finished" | "dnf" | "wishlist";
        rating:
          | "masterpiece"
          | "great"
          | "good"
          | "average"
          | "appalling"
          | null;
        readingFormat: "e-book" | "paper" | "library loan" | "audio";
        startDate: Date | null;
        endDate: Date | null;
        comments: string | null;
        bookId: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
      };
    }[]
  >();
  const [finsihedList, setFinishedList] = useState<
    {
      books: {
        id: number;
        title: string;
        subtitle: string | null;
        authors: string[] | null;
        description: string | null;
        categories: string[] | null;
        isbn: string | null;
        bookImage: string | null;
        pageCount: number | null;
        publishedDate: Date | null;
        publisher: string | null;
        userId: number;
        createdAt: Date;
      };
      reading_progress: {
        id: number;
        readingProgress: "reading" | "finished" | "dnf" | "wishlist";
        rating:
          | "masterpiece"
          | "great"
          | "good"
          | "average"
          | "appalling"
          | null;
        readingFormat: "e-book" | "paper" | "library loan" | "audio";
        startDate: Date | null;
        endDate: Date | null;
        comments: string | null;
        bookId: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
      };
    }[]
  >();
  const [dnfList, setDnfList] = useState<
    {
      books: {
        id: number;
        title: string;
        subtitle: string | null;
        authors: string[] | null;
        description: string | null;
        categories: string[] | null;
        isbn: string | null;
        bookImage: string | null;
        pageCount: number | null;
        publishedDate: Date | null;
        publisher: string | null;
        userId: number;
        createdAt: Date;
      };
      reading_progress: {
        id: number;
        readingProgress: "reading" | "finished" | "dnf" | "wishlist";
        rating:
          | "masterpiece"
          | "great"
          | "good"
          | "average"
          | "appalling"
          | null;
        readingFormat: "e-book" | "paper" | "library loan" | "audio";
        startDate: Date | null;
        endDate: Date | null;
        comments: string | null;
        bookId: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
      };
    }[]
  >();

  const router = useRouter();

  useEffect(() => {
    const userData = window.sessionStorage.getItem("user");

    if (userData) {
      const user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
      } = JSON.parse(userData);

      if (user.email != "") {
        setLoggedIn(true);
        setUser(user);
      } else {
        setLoggedIn(false);
        setUser(undefined);
      }

      async function getAllBooks(user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
      }) {
        const reading = await getAllBooksByReadingStatus(user, "reading");

        if (reading.status == "success" && reading.books) {
          const readingList: {
            books: {
              id: number;
              title: string;
              subtitle: string | null;
              authors: string[] | null;
              description: string | null;
              categories: string[] | null;
              isbn: string | null;
              bookImage: string | null;
              pageCount: number | null;
              publishedDate: Date | null;
              publisher: string | null;
              userId: number;
              createdAt: Date;
            };
            reading_progress: {
              id: number;
              readingProgress: "reading" | "finished" | "dnf" | "wishlist";
              rating:
                | "masterpiece"
                | "great"
                | "good"
                | "average"
                | "appalling"
                | null;
              readingFormat: "e-book" | "paper" | "library loan" | "audio";
              startDate: Date | null;
              endDate: Date | null;
              comments: string | null;
              bookId: number;
              userId: number;
              createdAt: Date;
              updatedAt: Date;
            };
          }[] = JSON.parse(reading.books);

          setReadingList(readingList);
        }
console.log(reading)
        // ---------------
        const wishlist = await getAllBooksByReadingStatus(user, "wishlist");

        if (wishlist.status == "success" && wishlist.books) {
          const wishList: {
            books: {
              id: number;
              title: string;
              subtitle: string | null;
              authors: string[] | null;
              description: string | null;
              categories: string[] | null;
              isbn: string | null;
              bookImage: string | null;
              pageCount: number | null;
              publishedDate: Date | null;
              publisher: string | null;
              userId: number;
              createdAt: Date;
            };
            reading_progress: {
              id: number;
              readingProgress: "reading" | "finished" | "dnf" | "wishlist";
              rating:
                | "masterpiece"
                | "great"
                | "good"
                | "average"
                | "appalling"
                | null;
              readingFormat: "e-book" | "paper" | "library loan" | "audio";
              startDate: Date | null;
              endDate: Date | null;
              comments: string | null;
              bookId: number;
              userId: number;
              createdAt: Date;
              updatedAt: Date;
            };
          }[] = JSON.parse(wishlist.books);

          setWishlist(wishList);
        }

        // ---------------
        const finished = await getAllBooksByReadingStatus(user, "finished");

        if (finished.status == "success" && finished.books) {
          const finishedList: {
            books: {
              id: number;
              title: string;
              subtitle: string | null;
              authors: string[] | null;
              description: string | null;
              categories: string[] | null;
              isbn: string | null;
              bookImage: string | null;
              pageCount: number | null;
              publishedDate: Date | null;
              publisher: string | null;
              userId: number;
              createdAt: Date;
            };
            reading_progress: {
              id: number;
              readingProgress: "reading" | "finished" | "dnf" | "wishlist";
              rating:
                | "masterpiece"
                | "great"
                | "good"
                | "average"
                | "appalling"
                | null;
              readingFormat: "e-book" | "paper" | "library loan" | "audio";
              startDate: Date | null;
              endDate: Date | null;
              comments: string | null;
              bookId: number;
              userId: number;
              createdAt: Date;
              updatedAt: Date;
            };
          }[] = JSON.parse(finished.books);

          setFinishedList(finishedList);
        }

        // ---------------
        const dnf = await getAllBooksByReadingStatus(user, "dnf");

        console.log("dnf", dnf)

        if (dnf.status == "success" && dnf.books) {
           const dnfList: {
             books: {
               id: number;
               title: string;
               subtitle: string | null;
               authors: string[] | null;
               description: string | null;
               categories: string[] | null;
               isbn: string | null;
               bookImage: string | null;
               pageCount: number | null;
               publishedDate: Date | null;
               publisher: string | null;
               userId: number;
               createdAt: Date;
             };
             reading_progress: {
               id: number;
               readingProgress: "reading" | "finished" | "dnf" | "wishlist";
               rating:
                 | "masterpiece"
                 | "great"
                 | "good"
                 | "average"
                 | "appalling"
                 | null;
               readingFormat: "e-book" | "paper" | "library loan" | "audio";
               startDate: Date | null;
               endDate: Date | null;
               comments: string | null;
               bookId: number;
               userId: number;
               createdAt: Date;
               updatedAt: Date;
             };
           }[] = JSON.parse(dnf.books);

           setDnfList(dnfList);
        }
      }

      getAllBooks(user);
    }
  }, []);

  // CREATES A BLANK BOOK PLACEHOLDER TILL DATA LOADS
  const placeholder = [];
  for (let i = 0; i < 15; i++) {
    placeholder.push(
      <div
        className="loading-book flex w-fit flex-col items-center justify-center"
        key={i}
      >
        <div className="blank-book h-45 w-32 bg-gray-400"></div>
        <hr className="my-2 w-25 border-2 border-gray-600" />
        <hr className="w-20 border-2 border-gray-600" />
      </div>,
    );
  }

  return (
    <MainGrid>
      {loggedin ? (
        <section
          id="library"
          className="col-span-4 md:col-span-6 lg:col-span-12"
        >
          <MainHeader user={user} />

          <Accordion type="single" collapsible defaultValue="accordion-item-1">
            <Dropdown name="Wish List" index={0}>
              {wishlist ? (
                <div className="books-list-wrapper horizontal-media-scroller">
                  {wishlist.map((item, index: number) => (
                    <Sheet key={index}>
                      <SheetTrigger asChild>
                        <div className="book-wrapper cursor-pointer">
                          <div className="book-image-wrapper relative h-45 w-40">
                            {item.books.bookImage && (
                              <Image
                                src={item.books.bookImage}
                                alt={item.books.title}
                                fill={true}
                                objectFit="contain"
                              />
                            )}
                          </div>
                          <p className="text-center font-semibold">
                            {item.books.title}
                          </p>
                          {item.books.authors && (
                            <p className="text-center text-sm">
                              {item.books.authors[0]}
                            </p>
                          )}
                        </div>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="overflow-y-scroll p-6"
                      >
                        <SheetTitle className="text-center text-xl">
                          <div className="book-image-wrapper relative h-45 w-40">
                            {item.books.bookImage && (
                              <Image
                                src={item.books.bookImage}
                                alt={item.books.title}
                                fill={true}
                                objectFit="contain"
                              />
                            )}
                          </div>
                        </SheetTitle>
                        {/* TODO: add prefilled book and reader information */}
                        <BookForm user={user} />
                        <SheetFooter className="p-0">
                          <SheetClose asChild>
                            <Button className="bg-primary-black w-full cursor-pointer">
                              Close
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  ))}
                </div>
              ) : (
                <div
                  className="loading-wrapper horizontal-media-scroller"
                  style={{ overflow: "hidden" }}
                >
                  {placeholder}
                </div>
              )}
            </Dropdown>

            <Dropdown name="Reading" index={1}>
              {readingList ? (
                <div className="books-list-wrapper horizontal-media-scroller">
                  {readingList.map((item, index: number) => (
                    <Sheet key={index}>
                      <SheetTrigger asChild>
                        <div className="book-wrapper cursor-pointer">
                          <div className="book-image-wrapper relative h-45 w-40">
                            {item.books.bookImage && (
                              <Image
                                src={item.books.bookImage}
                                alt={item.books.title}
                                fill={true}
                                objectFit="contain"
                              />
                            )}
                          </div>
                          <p className="text-center font-semibold">
                            {item.books.title}
                          </p>
                          {item.books.authors && (
                            <p className="text-center text-sm">
                              {item.books.authors[0]}
                            </p>
                          )}
                        </div>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="overflow-y-scroll p-6"
                      >
                        <SheetTitle className="text-center text-xl">
                          <div className="book-image-wrapper relative h-45 w-40">
                            {item.books.bookImage && (
                              <Image
                                src={item.books.bookImage}
                                alt={item.books.title}
                                fill={true}
                                objectFit="contain"
                              />
                            )}
                          </div>
                        </SheetTitle>
                        {/* TODO: add prefilled book and reader information */}
                        <BookForm user={user} />
                        <SheetFooter className="p-0">
                          <SheetClose asChild>
                            <Button className="bg-primary-black w-full cursor-pointer">
                              Close
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  ))}
                </div>
              ) : (
                <div
                  className="loading-wrapper horizontal-media-scroller"
                  style={{ overflow: "hidden" }}
                >
                  {placeholder}
                </div>
              )}
            </Dropdown>

            <Dropdown name="Finished" index={2}>
              {finsihedList ? (
                <div className="books-list-wrapper horizontal-media-scroller">
                  {finsihedList.map((item, index: number) => (
                    <Sheet key={index}>
                      <SheetTrigger asChild>
                        <div className="book-wrapper cursor-pointer">
                          <div className="book-image-wrapper relative h-45 w-40">
                            {item.books.bookImage && (
                              <Image
                                src={item.books.bookImage}
                                alt={item.books.title}
                                fill={true}
                                objectFit="contain"
                              />
                            )}
                          </div>
                          <p className="text-center font-semibold">
                            {item.books.title}
                          </p>
                          {item.books.authors && (
                            <p className="text-center text-sm">
                              {item.books.authors[0]}
                            </p>
                          )}
                        </div>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="overflow-y-scroll p-6"
                      >
                        <SheetTitle className="text-center text-xl">
                          <div className="book-image-wrapper relative h-45 w-40">
                            {item.books.bookImage && (
                              <Image
                                src={item.books.bookImage}
                                alt={item.books.title}
                                fill={true}
                                objectFit="contain"
                              />
                            )}
                          </div>
                        </SheetTitle>
                        {/* TODO: add prefilled book and reader information */}
                        <BookForm user={user} />
                        <SheetFooter className="p-0">
                          <SheetClose asChild>
                            <Button className="bg-primary-black w-full cursor-pointer">
                              Close
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  ))}
                </div>
              ) : (
                <div
                  className="loading-wrapper horizontal-media-scroller"
                  style={{ overflow: "hidden" }}
                >
                  {placeholder}
                </div>
              )}
            </Dropdown>

            <Dropdown name="DNF" index={3}>
              {dnfList ? (
                <div className="books-list-wrapper horizontal-media-scroller">
                  {dnfList.map((item, index: number) => (
                    <Sheet key={index}>
                      <SheetTrigger asChild>
                        <div className="book-wrapper cursor-pointer">
                          <div className="book-image-wrapper relative h-45 w-40">
                            {item.books.bookImage && (
                              <Image
                                src={item.books.bookImage}
                                alt={item.books.title}
                                fill={true}
                                objectFit="contain"
                              />
                            )}
                          </div>
                          <p className="text-center font-semibold">
                            {item.books.title}
                          </p>
                          {item.books.authors && (
                            <p className="text-center text-sm">
                              {item.books.authors[0]}
                            </p>
                          )}
                        </div>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="overflow-y-scroll p-6"
                      >
                        <SheetTitle className="text-center text-xl">
                          <div className="book-image-wrapper relative h-45 w-40">
                            {item.books.bookImage && (
                              <Image
                                src={item.books.bookImage}
                                alt={item.books.title}
                                fill={true}
                                objectFit="contain"
                              />
                            )}
                          </div>
                        </SheetTitle>
                        {/* TODO: add prefilled book and reader information */}
                        <BookForm user={user} />
                        <SheetFooter className="p-0">
                          <SheetClose asChild>
                            <Button className="bg-primary-black w-full cursor-pointer">
                              Close
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  ))}
                </div>
              ) : (
                <div
                  className="loading-wrapper horizontal-media-scroller"
                  style={{ overflow: "hidden" }}
                >
                  {placeholder}
                </div>
              )}
            </Dropdown>
          </Accordion>
        </section>
      ) : (
        <section
          id="logged-out"
          className="col-span-4 flex h-[60vh] flex-col items-center justify-center md:col-span-6 lg:col-span-12"
        >
          <h1 className="mb-2 text-2xl font-bold">
            You&apos;re not logged in!
          </h1>
          <Button
            className="pink cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Back to Login
          </Button>
        </section>
      )}
    </MainGrid>
  );
}
