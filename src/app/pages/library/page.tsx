"use client";
import Book from "@/app/components/Book";
import BookInfo from "@/app/components/BookInfo";
import BookScreen from "@/app/components/BookScreen";
import Dropdown from "@/app/components/Dropdown";
import MainGrid from "@/app/components/MainGrid";
import SearchBar from "@/app/components/SearchBar";
import { Book as BookType, LibraryList } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Accordion } from "@radix-ui/react-accordion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchBooksByReadingProgress } from "../utils/utils";

export default function Library() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<{
    wishlist: boolean;
    reading: boolean;
    finished: boolean;
    dnf: boolean;
  }>({
    wishlist: true,
    reading: true,
    finished: true,
    dnf: true,
  });

  const [libraryList, setLibraryList] = useState<LibraryList>({
    wishlist: [],
    reading: [],
    finished: [],
    dnf: [],
  });

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

  const router = useRouter();
  

  useEffect(() => {
    const userData = window.sessionStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      setLoggedIn(true);

      async function getAllBooks(userEmail: string) {
        const wishList = await fetchBooksByReadingProgress(
          "wishlist",
          userEmail,
        );

        await new Promise((res) => setTimeout(res, 200)); // wait 0.2 seconds

        setLibraryList({
          wishlist: wishList,
          reading: [],
          finished: [],
          dnf: [],
        });

        setIsLoading({
          wishlist: false,
          reading: true,
          finished: true,
          dnf: true,
        });

        const readingList = await fetchBooksByReadingProgress(
          "reading",
          userEmail,
        );

        await new Promise((res) => setTimeout(res, 200)); // wait 0.2 seconds
        setLibraryList({
          wishlist: wishList,
          reading: readingList,
          finished: [],
          dnf: [],
        });

        setIsLoading({
          wishlist: false,
          reading: false,
          finished: true,
          dnf: true,
        });

        const finishedList = await fetchBooksByReadingProgress(
          "finished",
          userEmail,
        );

        await new Promise((res) => setTimeout(res, 200)); // wait 0.2 seconds

        setLibraryList({
          wishlist: [],
          reading: [],
          finished: finishedList,
          dnf: [],
        });

        setIsLoading({
          wishlist: false,
          reading: false,
          finished: false,
          dnf: true,
        });

        const dnfList = await fetchBooksByReadingProgress("dnf", userEmail);

        setLibraryList({
          wishlist: wishList,
          reading: readingList,
          finished: finishedList,
          dnf: dnfList,
        });

        setIsLoading({
          wishlist: false,
          reading: false,
          finished: false,
          dnf: false,
        });
      }

      getAllBooks(user.email);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <MainGrid>
      <SearchBar setCache={setLibraryList} />

      {loggedIn ? (
        <section
          id="accordion-section"
          className="col-span-4 md:col-span-6 lg:col-span-12"
        >
          <div className="accordion-wrapper w-full">
            <Accordion
              type="single"
              collapsible
              defaultValue="accordion-item-1"
            >
              <Dropdown name="Wish List" index={0}>
                {isLoading["wishlist"] ? (
                  <div
                    className="loading-wrapper horizontal-media-scroller"
                    style={{ overflow: "hidden" }}
                  >
                    {placeholder}
                  </div>
                ) : libraryList && libraryList["wishlist"].length != 0 ? (
                  <div className="books-wrapper horizontal-media-scroller">
                    {libraryList["wishlist"].map(
                      (data: BookType, index: number) => (
                        <BookScreen
                          key={index}
                          screenTrigger={<Book key={index} book={data} />}
                        >
                          <BookInfo book={data} setCache={setLibraryList} />
                        </BookScreen>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-center">
                    You&apos;re not reading any books yet!
                  </p>
                )}
              </Dropdown>

              <Dropdown name="Reading" index={1}>
                {isLoading["reading"] ? (
                  <div
                    className="loading-wrapper horizontal-media-scroller"
                    style={{ overflow: "hidden" }}
                  >
                    {placeholder}
                  </div>
                ) : libraryList && libraryList["reading"].length != 0 ? (
                  <div className="books-wrapper horizontal-media-scroller">
                    {libraryList["reading"].map(
                      (data: BookType, index: number) => (
                        <BookScreen
                          key={index}
                          screenTrigger={<Book key={index} book={data} />}
                        >
                          <BookInfo book={data} setCache={setLibraryList} />
                        </BookScreen>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-center">
                    You&apos;re not reading any books yet!
                  </p>
                )}
              </Dropdown>

              <Dropdown name="Finished" index={2}>
                {isLoading["finished"] ? (
                  <div
                    className="loading-wrapper horizontal-media-scroller"
                    style={{ overflow: "hidden" }}
                  >
                    {placeholder}
                  </div>
                ) : libraryList && libraryList["finished"].length != 0 ? (
                  <div className="books-wrapper horizontal-media-scroller">
                    {libraryList["finished"].map(
                      (data: BookType, index: number) => (
                        <BookScreen
                          key={index}
                          screenTrigger={<Book key={index} book={data} />}
                        >
                          <BookInfo book={data} setCache={setLibraryList} />
                        </BookScreen>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-center">
                    You&apos;re not reading any books!
                  </p>
                )}
              </Dropdown>

              <Dropdown name="DNF" index={3}>
                {isLoading["dnf"] ? (
                  <div
                    className="loading-wrapper horizontal-media-scroller"
                    style={{ overflow: "hidden" }}
                  >
                    {placeholder}
                  </div>
                ) : libraryList && libraryList["dnf"].length != 0 ? (
                  <div className="books-wrapper horizontal-media-scroller">
                    {libraryList["dnf"].map((data: BookType, index: number) => (
                      <BookScreen
                        key={index}
                        screenTrigger={<Book key={index} book={data} />}
                      >
                        <BookInfo book={data} setCache={setLibraryList} />
                      </BookScreen>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">
                    You&apos;ve read all your books!
                  </p>
                )}
              </Dropdown>
            </Accordion>
          </div>
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
